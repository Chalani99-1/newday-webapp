package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ClientorderDao;
import lk.newdayproducts.dao.ProductDao;
import lk.newdayproducts.dao.ProductionorderDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.dto.NotifyResponse;
import lk.newdayproducts.entity.*;
import lk.newdayproducts.util.business.ExtractedData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/productionorders")
public class ProductionorderController {

    @Autowired
    private ClientorderDao codao;

    @Autowired
    private ProductionorderDao podao;

    @Autowired
    private RawmaterialDao rmdao;

    @Autowired
    private ProductDao productDao;

    @GetMapping(path = "/number", produces = "application/json")
    public ResponseEntity<Integer> get() {
        int maxid = 0;
        List<Productionorder> exist = this.podao.findAll();
        if (!exist.isEmpty()) {
            maxid = this.podao.findMaxNumber();
        } else {
            maxid = 0;
        }
        return ResponseEntity.ok().body(maxid);
    }

    //util method
    public static ExtractedData extractNumberAndText(String input) {
        Pattern pattern = Pattern.compile("(\\d+\\.?\\d*)\\s*(\\D+)");
        Matcher matcher = pattern.matcher(input);
        if (matcher.find()) {
            String numberPart = matcher.group(1);
            String textPart = matcher.group(2).trim();
            BigDecimal number = new BigDecimal(numberPart);
            return new ExtractedData(number, textPart);
        } else {
            return new ExtractedData();
        }
    }

    private String calcResourceLimit(Productrawmaterial prm, BigDecimal quantity, String currentRL) {
        String rmSize = prm.getRawmaterial().getMaterialcategory().getMcsize().getName();
        ExtractedData extractedData = extractNumberAndText(rmSize);
        BigDecimal rmLimit = extractedData.getNumber().multiply(quantity);
        String rmStr = extractedData.getText();
        BigDecimal currentRmLimitInt = extractNumberAndText(currentRL).getNumber();
        BigDecimal updateRlInt = currentRmLimitInt.subtract(rmLimit).setScale(2, RoundingMode.HALF_DOWN);
        String updatedRmLimit = updateRlInt + " " + rmStr;
//        System.out.println("currentrl:"+currentRL +"rm size :"+rmSize + " extrcted :"+extractedData +" rmstart :"+ rmStr+ " crl :"+currentRmLimitInt
//        + " rpdaterl :"+updatedRmLimit);
        return updatedRmLimit;
    }

    @GetMapping(path = "/incomplete", produces = "application/json")
    public List<NotifyResponse> getIncomplete(@RequestParam HashMap<String, String> params) {

        List<Productionorder> incomplete = this.podao.findIncomplete();
        List<NotifyResponse> porders = new ArrayList<>();
        for (Productionorder s : incomplete) {
            porders.add(
                    new NotifyResponse(
                         "Please Complete the order : " +  s.getOrdernumber() + " of Client Order : -   " + s.getClientorder().getNumber()+
                          " as it expected before "+ s.getDorequired().toString() ) );

        }
        if (params.isEmpty()) return porders;
        Stream<NotifyResponse> postream = porders.stream();
        return postream.collect(Collectors.toList());
    }

    @GetMapping(path = "/incompletecos", produces = "application/json")
    public List<NotifyResponse> getIncompleteCos(@RequestParam HashMap<String, String> params) {

        List<Clientorder> incomplete = this.podao.findIncompleteCos();
        List<NotifyResponse> porders = new ArrayList<>();
        for (Clientorder s : incomplete) {
            porders.add(
                    new NotifyResponse(
                            "Please Complete the Client order  : " +  s.getNumber() +
                            " as it expected before "+ s.getDoexpected().toString() ) );

        }
        if (params.isEmpty()) return porders;
        Stream<NotifyResponse> postream = porders.stream();
        return postream.collect(Collectors.toList());
    }

    @GetMapping(produces = "application/json")
    public List<Productionorder> get(@RequestParam HashMap<String, String> params) {

        String employeeid = params.get("employeeid");
        String doplaced = params.get("doplaced");
        String dorequired = params.get("dorequired");
        String ordernumber = params.get("ordernumber");


        List<Productionorder> porders = this.podao.findAll();

        if (params.isEmpty()) return porders;

        Stream<Productionorder> postream = porders.stream();

        if (employeeid != null)
            postream = postream.filter(o -> o.getEmployee().getId() == Integer.parseInt(employeeid));
        if (doplaced != null) postream = postream.filter(o -> o.getDoplaced().toString().contains(doplaced));
        if (dorequired != null) postream = postream.filter(o -> o.getDorequired().toString().contains(dorequired));
        if (ordernumber != null) postream = postream.filter(o -> o.getOrdernumber().contains(ordernumber));

        return postream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Productionorder order) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        if (podao.findbyNumber(order.getOrdernumber()) != null)
            errors = errors + "<br> Existing Production Order";

        loop:
        if (errors == "") {
            boolean isProductionOrderCompleteStatus = false;
            if (order.getProductionorderstatus().getName().equalsIgnoreCase("completed")) {
                isProductionOrderCompleteStatus = true;
            }
            if (isProductionOrderCompleteStatus) {
                Clientorder existingCO = codao.findByMyId(order.getClientorder().getId());
                Integer existingCOID = order.getClientorder().getId();
                Product existingProduct = order.getProduct();
                Integer productAmount = order.getAmount();

                for (Orderproduct op : existingCO.getOrderproducts()) {
                    Integer idOfProduct = op.getProduct().getId();
                    if (Objects.equals(idOfProduct, existingProduct.getId())) {
                        //rm updates
                        Product product = productDao.findByMyId(idOfProduct);
                        for (Productrawmaterial prm : product.getProductrawmaterials()) {
                            Integer rmId = prm.getRawmaterial().getId();
                            BigDecimal quantity = new BigDecimal(productAmount).multiply(prm.getQuantity());

                            BigDecimal qoh = rmdao.findQOHByMyId(rmId);
                            String crl = prm.getRawmaterial().getResourcelimit();
                            // Check if qoh is less than or equal to quantity
                            if (qoh.compareTo(quantity) < 0) {
                                errors = errors + prm.getRawmaterial().getName() + " : Out Of Stock<br>Available Quantity:" + (qoh) + "<br>" +
                                         "Requested Quantity : " + quantity + "<br> Please Contact General Manager";
                                break loop;
                            } else {
                                rmdao.updateRawMaterialQuantity(quantity, rmId);
                                String newRl = calcResourceLimit(prm, quantity, crl);
                                rmdao.updateRlAfterProduction(newRl, rmId);

                                //cal rm status
                                BigDecimal ropafter = rmdao.findROPByMyId(rmId);
                                BigDecimal qohafter = rmdao.findQOHByMyId(rmId);

                                if (qohafter.compareTo(BigDecimal.ONE) <= 0) {
                                    // qohafter <= 1
                                    //mat status is 2 ; out of stock
                                    rmdao.updateRmStatusAfter(rmId, 2);
                                } else if (qohafter.compareTo(ropafter) <= 0) {
                                    // qoh is less than or equal to rop
                                    //mat status is 3 ; need to stock
                                    rmdao.updateRmStatusAfter(rmId, 3);
                                }
                            }
                        }
                        //co update
                        codao.updateExistingProductQuantity(productAmount, idOfProduct, existingCOID);
                    }
                }

                //co complete percentage updating
                Integer totalamount2 = 0;
                Integer completed2 = 0;
                Clientorder co = order.getClientorder();
                completed2 = codao.findOpCompleted(co.getId());
                totalamount2 = codao.findOpAmount(co.getId());
                double percentage2 = ((double) completed2 / totalamount2) * 100;
                String formattedPercentage2 = String.format("%.2f", percentage2);
                codao.updatePercentage(formattedPercentage2, co.getId());

                double hundred2 = 100.00;

                if (percentage2 >= hundred2) {
                    // Values are equal
                    codao.updateCOStatus(2, co.getId());
                } else if (percentage2 < 100.00 && percentage2 > 0.00) {
                    codao.updateCOStatus(3, co.getId());
                } else {
                    codao.updateCOStatus(1, co.getId());
                }

            } else {
                //status not complete but have to check rm quantity
                Clientorder existingCO = codao.findByMyId(order.getClientorder().getId());
                Product existingProduct = order.getProduct();
                Integer productAmount = order.getAmount();

                for (Orderproduct op : existingCO.getOrderproducts()) {
                    Integer idOfProduct = op.getProduct().getId();
                    if (Objects.equals(idOfProduct, existingProduct.getId())) {
                        //rm quantity check
                        Product product = productDao.findByMyId(idOfProduct);
                        for (Productrawmaterial prm : product.getProductrawmaterials()) {
                            Integer rmId = prm.getRawmaterial().getId();
                            BigDecimal quantity = new BigDecimal(productAmount).multiply(prm.getQuantity());

                            BigDecimal qoh = rmdao.findQOHByMyId(rmId);
                            String crl = prm.getRawmaterial().getResourcelimit();
                            // Check if qoh is less than or equal to quantity
                            if (qoh.compareTo(quantity) < 0) {
                                errors = errors + prm.getRawmaterial().getName() + " : Out Of Stock<br>Available Quantity:" + (qoh) + "<br>" +
                                         "Requested Quantity : " + quantity + "<br> Please Contact General Manager";
                                break loop;
                            } else {
                                //rm enough.so this need to be updated even production is not complete
                                rmdao.updateRawMaterialQuantity(quantity, rmId);
                                String newRl = calcResourceLimit(prm, quantity, crl);
                                rmdao.updateRlAfterProduction(newRl, rmId);

                                //cal rm status
                                BigDecimal ropafter = rmdao.findROPByMyId(rmId);
                                BigDecimal qohafter = rmdao.findQOHByMyId(rmId);

                                if (qohafter.compareTo(BigDecimal.ONE) <= 0) {
                                    // qohafter <= 1
                                    //mat status is 2 ; out of stock
                                    rmdao.updateRmStatusAfter(rmId, 2);
                                } else if (qohafter.compareTo(ropafter) <= 0) {
                                    // qoh is less than or equal to rop
                                    //mat status is 3 ; need to stock
                                    rmdao.updateRmStatusAfter(rmId, 3);
                                }
                            }
                        }

                    }
                }

            }
            if (errors == "") podao.save(order);

        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(order.getId()));
        response.put("url", "/productions/" + order.getId());
        response.put("errors", errors);

        return response;
    }


    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Productionorder order) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Productionorder oldPO = podao.findByMyId(order.getId());
        Integer newAmount = order.getAmount();

        if (oldPO == null || !(order.getOrdernumber().equals(oldPO.getOrdernumber())))
            errors = errors + "<br> Production Order Does Not Exist";


        loop1:
        if (errors == "") {
            Integer productAmount = oldPO.getAmount();
            Integer productAmountForRmUpdates = productAmount;
            podao.save(order);

//get the relevant co according to this production
            Clientorder co = codao.findByMyId(oldPO.getClientorder().getId());
            Product existingProduct = oldPO.getProduct();

            for (Orderproduct op : co.getOrderproducts()) {
                Integer idOfProduct = op.getProduct().getId();
                if (idOfProduct == existingProduct.getId()) {
                    //rm updates
                    Product product = productDao.findByMyId(idOfProduct);
                    for (Productrawmaterial prm : product.getProductrawmaterials()) {
                        Integer rmId = prm.getRawmaterial().getId();
                        BigDecimal qoh = rmdao.findQOHByMyId(rmId);
                        if (productAmountForRmUpdates < newAmount) { //have to reduce rm count
                            BigDecimal extra = new BigDecimal((newAmount - productAmountForRmUpdates)).multiply(prm.getQuantity());
                            if (qoh.compareTo(extra) < 0) {
                                errors = errors + prm.getRawmaterial().getName() + " : Out Of Stock<br>Available Quantity:" + (qoh) + "<br>" +
                                         "Requested Quantity : " + extra + "<br> Please Contact General Manager";
                                break loop1;
                            } else {
                                rmdao.updateRawMaterialQuantity(extra, rmId);
                                String crl = prm.getRawmaterial().getResourcelimit();
                                String newRl = calcResourceLimit(prm, extra, crl);
                                rmdao.updateRlAfterProduction(newRl, rmId);

                                //cal rm status
                                BigDecimal ropafter = rmdao.findROPByMyId(rmId);
                                BigDecimal qohafter = rmdao.findQOHByMyId(rmId);

                                if (qohafter.compareTo(BigDecimal.ONE) <= 0) {
                                    // qohafter <= 1
                                    //mat status is 2 ; out of stock
                                    rmdao.updateRmStatusAfter(rmId, 2);
                                } else if (qohafter.compareTo(ropafter) <= 0) {
                                    // qoh is less than or equal to rop
                                    //mat status is 3 ; need to stock
                                    rmdao.updateRmStatusAfter(rmId, 3);
                                }

                            }
                        } else {
//                            productAmountForRmUpdates >= newAmount
                            BigDecimal reduced = new BigDecimal((productAmountForRmUpdates - newAmount)).multiply(prm.getQuantity());
                            rmdao.updateRawMaterialQuantityAfterUpdate(reduced, rmId);
                            String crl = prm.getRawmaterial().getResourcelimit();
                            String newRl = calcResourceLimit(prm, reduced.negate(), crl);
                            rmdao.updateRlAfterProduction(newRl, rmId);

                            //cal rm status
                            BigDecimal ropafter = rmdao.findROPByMyId(rmId);
                            BigDecimal qohafter = rmdao.findQOHByMyId(rmId);

                            if (qohafter.compareTo(BigDecimal.ONE) <= 0) {
                                // qohafter <= 1
                                //mat status is 2 ; out of stock
                                rmdao.updateRmStatusAfter(rmId, 2);
                            } else if (qohafter.compareTo(ropafter) <= 0) {
                                // qoh is less than or equal to rop
                                //mat status is 3 ; need to stock
                                rmdao.updateRmStatusAfter(rmId, 3);
                            }

                        }
                    }

                    //co updates
                    //does not matter new amount large or smaller than old
                    //need to check if product amount changed or not
                    if (newAmount == productAmount) {
                        productAmount = 0; //bcz we need to save the newamount in co op table
                    }
                    codao.updateExistingProductQuantityAfterUpdate(newAmount, productAmount, existingProduct.getId(), co.getId());
                }
            }

            //co complete percentage updating
            Integer totalamount2 = 0;
            Integer completed2 = 0;
            completed2 = codao.findOpCompleted(co.getId());
            totalamount2 = codao.findOpAmount(co.getId());
            double percentage2 = ((double) completed2 / totalamount2) * 100;
            String formattedPercentage2 = String.format("%.2f", percentage2);
            codao.updatePercentage(formattedPercentage2, co.getId());
            BigDecimal completepercentage2 = codao.getComletedPercentage(co.getId()).setScale(2, RoundingMode.HALF_UP);
            double hundred2 = 100.00;

            if (percentage2 >= hundred2) {
                // Values are equal
                codao.updateCOStatus(2, co.getId());
            } else if (percentage2 < 100.00 && percentage2 > 0.00) {
                codao.updateCOStatus(3, co.getId());
            } else {
                codao.updateCOStatus(1, co.getId());
            }


        } else errors = "Server Validation Errors : <br> " + errors;

        response.put("id", String.valueOf(order.getId()));
        response.put("url", "/productions/" + order.getId());
        response.put("errors", errors);

        return response;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Productionorder extPO = podao.findByMyId(id);

        if (extPO == null) errors = errors + "<br> Production Order Does Not Exist";

        if (errors == "") {

            Clientorder existingCO = codao.findByMyId(extPO.getClientorder().getId());
            Integer existingCOID = existingCO.getId();
            Product existingProduct = extPO.getProduct();
            Integer productAmount = extPO.getAmount();

            for (Orderproduct op : existingCO.getOrderproducts()) {
                Integer idOfProduct = op.getProduct().getId();
                if (Objects.equals(idOfProduct, existingProduct.getId())) {
                    //rm updates
                    Product product = productDao.findByMyId(idOfProduct);
                    for (Productrawmaterial prm : product.getProductrawmaterials()) {
                        Integer rmId = prm.getRawmaterial().getId();
                        BigDecimal quantity = new BigDecimal(productAmount).multiply(prm.getQuantity());
                        rmdao.updateRawMaterialQuantityAfterDelete(quantity, rmId);
                        //crl update
                        String crl = prm.getRawmaterial().getResourcelimit();
                        String newRl = calcResourceLimit(prm, quantity.negate(), crl);
                        rmdao.updateRlAfterProduction(newRl, rmId);

                        //cal rm status
                        BigDecimal ropafter = rmdao.findROPByMyId(rmId);
                        BigDecimal qohafter = rmdao.findQOHByMyId(rmId);

                        if (qohafter.compareTo(BigDecimal.ONE) <= 0) {
                            // qohafter <= 1
                            //mat status is 2 ; out of stock
                            rmdao.updateRmStatusAfter(rmId, 2);
                        } else if (qohafter.compareTo(ropafter) <= 0) {
                            // qoh is less than or equal to rop
                            //mat status is 3 ; need to stock
                            rmdao.updateRmStatusAfter(rmId, 3);
                        }

                    }
                    //co updates
                    codao.updateExistingProductQuantityAfterDelete(productAmount, existingProduct.getId(), existingCO.getId());
                }
            }

            //co complete percentage updating
            Integer totalamount2 = 0;
            Integer completed2 = 0;
            Clientorder co = extPO.getClientorder();
            completed2 = codao.findOpCompleted(co.getId());
            totalamount2 = codao.findOpAmount(co.getId());
            double percentage2 = ((double) completed2 / totalamount2) * 100;
            String formattedPercentage2 = String.format("%.2f", percentage2);
            codao.updatePercentage(formattedPercentage2, co.getId());
            double hundred2 = 100.00;

            if (percentage2 >= hundred2) {
                // Values are equal
                codao.updateCOStatus(2, co.getId());
            } else if (percentage2 < 100.00 && percentage2 > 0.00) {
                codao.updateCOStatus(3, co.getId());
            } else {
                codao.updateCOStatus(1, co.getId());
            }
            podao.delete(extPO);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }
        response.put("id", String.valueOf(id));
        response.put("url", "/productions/" + id);
        response.put("errors", errors);

        return response;
    }


}