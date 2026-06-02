package lk.newdayproducts.controller;

import lk.newdayproducts.dao.GrnDao;
import lk.newdayproducts.dao.PurchaseorderDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.entity.*;
import lk.newdayproducts.util.business.ExtractedData;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/grns")
public class GrnController {

    @Autowired
    private GrnDao grndao;

    @Autowired
    private RawmaterialDao rawmaterialDao;

    @Autowired
    private PurchaseorderDao purchaseorderDao;

    @GetMapping(path = "/number", produces = "application/json")
    public ResponseEntity<Map<String, String>> get() {
        int maxid = this.grndao.findMaxNumber();
        if (maxid == 0) maxid = 1;
        Map<String, String> response = new HashMap<>();
        response.put("number", "" + maxid);
        return ResponseEntity.ok().body(response);
    }

//    @GetMapping(path = "/number", produces = "application/json")
//    public ResponseEntity<Integer> get() {
//        int maxid = this.grndao.findMaxNumber();
//        if (maxid == 0) maxid = 1;
//        return ResponseEntity.ok().body(maxid);
//    }

    @GetMapping(path = "/getGrnsByPoId", produces = "application/json")
    public List<Grn> getGrnsByPoId(@RequestParam("poId") Integer poId) {
        List<Grn> grns = this.grndao.findGrnsByPurchaseOrderId(poId);
        return grns;
    }

    @GetMapping(produces = "application/json")
    public List<Grn> get(@RequestParam HashMap<String, String> params) {

        String employeeid = params.get("employeeid");
        String doreceived = params.get("doreceived");
        String purchaseorderid = params.get("purchaseorderid");
        String grnId = params.get("grnId");

        List<Grn> grns = this.grndao.findAll();

        if (params.isEmpty()) return grns;

        Stream<Grn> postream = grns.stream();

        if (grnId != null)
            postream = postream.filter(o -> o.getId() == Integer.parseInt(grnId));
        if (employeeid != null)
            postream = postream.filter(o -> o.getEmployee().getId() == Integer.parseInt(employeeid));
        if (purchaseorderid != null)
            postream = postream.filter(o -> o.getPurchaseorder().getId() == Integer.parseInt(purchaseorderid));
        if (doreceived != null) postream = postream.filter(o -> o.getDoreceived().toString().contains(doreceived));

        return postream.collect(Collectors.toList());

    }


//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public HashMap<String, String> add(@RequestBody Grn grn) {
//        HashMap<String, String> response = new HashMap<>();
//        String errors = "";
//        for (Grnrawmaterial grm : grn.getGrnrawmaterials()) {
//            grm.setGrn(grn);
//        }
//        if (grndao.findByNumber(grn.getNumber()) != null) errors = errors + "<br> Existing GRN";
//
//        if (errors == "") {
//            Purchaseorder existingPO = purchaseorderDao.findByMyId(grn.getPurchaseorder().getId());
//            Integer existingPOID = grn.getPurchaseorder().getId();
//
//
////if grn completed => update rm  and purchase order received
//            if (grn.getGrnstatus().getName().equalsIgnoreCase("Completed")) {
//                //po status update
//                purchaseorderDao.updateCompleted(2, existingPOID);
//                for (Poitem poi : existingPO.getPoitems()) {
//                    Integer idOfRm = poi.getRawmaterial().getId();
//                    for (Grnrawmaterial grnrm : grn.getGrnrawmaterials()) {
//                        if (Objects.equals(grnrm.getRawmaterial().getId(), idOfRm)) {
//                            //rm updates
//                            BigDecimal qoh = rawmaterialDao.findQOHByMyId(idOfRm);
//                            String currentRL = rawmaterialDao.findByMyId(idOfRm).getResourcelimit();
//                            Integer quantity = grnrm.getQuantity();
//                            String updatedResourceLimit = calcResourceLimit(grnrm, quantity, currentRL);
//                            //rm updates
//                            rawmaterialDao.updateRawMaterialQuantityAfterGrn(BigDecimal.valueOf(quantity), idOfRm);
//                            rawmaterialDao.updateRawMaterialResourceLimitAfterGrn(updatedResourceLimit, idOfRm);
//
//                            //cal rm status
//                            BigDecimal ropafter = rawmaterialDao.findROPByMyId(idOfRm);
//                            BigDecimal qohafter = rawmaterialDao.findQOHByMyId(idOfRm);
//
//                            if (qohafter.compareTo(BigDecimal.ONE) <= 0) {
//                                // qohafter <= 1
//                                //mat status is 2 ; out of stock
//                                rawmaterialDao.updateRmStatusAfter(idOfRm, 2);
//                            } else if (qohafter.compareTo(ropafter) <= 0) {
//                                // qoh is less than or equal to rop
//                                //mat status is 3 ; need to stock
//                                rawmaterialDao.updateRmStatusAfter(idOfRm, 3);
//                            } else {
//                                // qoh is > to rop
//                                //mat status is 1 ; available
//                                rawmaterialDao.updateRmStatusAfter(idOfRm, 1);
//                            }
//
//                            //po updates
//                            purchaseorderDao.updateExistingRMQuantity(quantity, idOfRm, existingPOID);
//
//                        }
//                    }
//
//                }
//                //received percentage updating
//                Integer totalamount = 0;
//                Integer completed = 0;
//                Purchaseorder epo = purchaseorderDao.findByMyId(grn.getPurchaseorder().getId());
//                completed = purchaseorderDao.findPOItemRMreceived(epo.getId());
//                totalamount = purchaseorderDao.findPOItemRmQuantity(epo.getId());
//                double percentage = ((double) completed / totalamount) * 100;
//                String formattedPercentage = String.format("%.2f", percentage);
//                double roundedPercentage = Double.parseDouble(formattedPercentage);
//                purchaseorderDao.updateReceivedPercentage(BigDecimal.valueOf(roundedPercentage), existingPOID);
//
//                double hundred = 100.00;
//
//                if (percentage >= hundred) {
//                    // receivedpercentage is 100
//                    purchaseorderDao.updateCompleted(3, existingPOID);
//                }else if (percentage < 100.00 && percentage > 0.00) {
//                    purchaseorderDao.updatePOStatus(2, existingPOID);
//                } else {
//                    purchaseorderDao.updatePOStatus(1, existingPOID);
//                }
//
//            }
//            grndao.save(grn);
////
//        } else {
//            errors = "Server Validation Errors : <br> " + errors;
//        }
//
//        response.put("id", String.valueOf(grn.getId()));
//        response.put("url", "/grns/" + grn.getId());
//        response.put("errors", errors);
//
//        return response;
//
//    }
//
//    private String calcResourceLimit(Grnrawmaterial grnrm, Integer quantity, String currentRL) {
//        String rmSize = grnrm.getRawmaterial().getMaterialcategory().getMcsize().getName();
//        ExtractedData extractedData = extractParts(rmSize);
//        BigDecimal rmLimit = extractedData.getNumber().multiply(new BigDecimal(quantity));
//        String rmStr = extractedData.getText();
//        BigDecimal currentRmLimitInt = extractParts(currentRL).getNumber();
//        BigDecimal updateRlInt = rmLimit.add(currentRmLimitInt);
//        String updatedRmLimit = updateRlInt + " " + rmStr;
//        return updatedRmLimit;
//    }
//
//
//    public static ExtractedData extractParts(String input) {
//        Pattern pattern = Pattern.compile("(\\d+\\.?\\d*)\\s*(\\D+)");
//        Matcher matcher = pattern.matcher(input);
//
//        if (matcher.find()) {
//            String numberPart = matcher.group(1);
//            String textPart = matcher.group(2).trim();
//
//            BigDecimal number = new BigDecimal(numberPart);
//
//            return new ExtractedData(number, textPart);
//        } else {
//            return new ExtractedData();
//        }
//    }


    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Grn grn) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";
        for (Grnrawmaterial grm : grn.getGrnrawmaterials()) {
            grm.setGrn(grn);
        }
        if (grndao.findByNumber(grn.getNumber()) != null)
            errors = errors + "<br> Existing GRN";
        if (errors == "") {
            Purchaseorder existingPO = purchaseorderDao.findByMyId(grn.getPurchaseorder().getId());
            Integer existingPOID = grn.getPurchaseorder().getId();

            //if grn completed=> update rm and pur order received
            if (grn.getGrnstatus().getName().equalsIgnoreCase("Completed")) {

                //po status update
                purchaseorderDao.updateCompleted(2, existingPOID);
                for (Poitem poi : existingPO.getPoitems()) {
                    Integer idOfRm = poi.getRawmaterial().getId();
                    for (Grnrawmaterial grnrm : grn.getGrnrawmaterials()) {
                        if (Objects.equals(grnrm.getRawmaterial().getId(), idOfRm)) {

                            //rm update
                            BigDecimal qoh = rawmaterialDao.findQOHByMyId(idOfRm);
                            String currentRL = rawmaterialDao.findByMyId(idOfRm).getResourcelimit();
                            Integer quantity = grnrm.getQuantity();
                            String updatedResourceLimit = calcResourceLimit(grnrm, quantity, currentRL);

                            //rm updates
                            rawmaterialDao.updateRawMaterialQuantityAfterGrn(BigDecimal.valueOf(quantity), idOfRm);
                            rawmaterialDao.updateRawMaterialResourceLimitAfterGrn(updatedResourceLimit, idOfRm);

                            //after cal rm status
                            BigDecimal ropafter = rawmaterialDao.findROPByMyId(idOfRm);
                            BigDecimal quhafter = rawmaterialDao.findQOHByMyId(idOfRm);

                            if (quhafter.compareTo(BigDecimal.ONE) <= 0) {
                                //qohafter<==1
                                //mat status is 3 ; out of stock
                                rawmaterialDao.updateRmStatusAfter(idOfRm, 2);
                            } else if (quhafter.compareTo(ropafter) <= 0) {
                                //qoh is less than or equal to rop
                                //mat status is 3 ; need to stock
                                rawmaterialDao.updateRmStatusAfter(idOfRm, 3);
                            } else {
                                //roq is> to rop
                                //mat status is 1; available
                                rawmaterialDao.updateRmStatusAfter(idOfRm, 1);
                            }

                            purchaseorderDao.updateExistingRMQuantity(quantity, idOfRm, existingPOID);
                        }
                    }
                }

                //received percentage update-value
                Integer totalamount = 0;
                Integer completed = 0;

                Purchaseorder epo = purchaseorderDao.findByMyId(grn.getPurchaseorder().getId());
                completed = purchaseorderDao.findPOItemRMreceived(epo.getId());
                totalamount = purchaseorderDao.findPOItemRmQuantity(epo.getId());
                double percentage = ((double) completed / totalamount) * 100;
                String formattedPercentage = String.format("%.2f", percentage);
                double roundedPercentage = Double.parseDouble(formattedPercentage);
                purchaseorderDao.updateReceivedPercentage(BigDecimal.valueOf(roundedPercentage), existingPOID);


                //purchase order status update according to received percentage
                double hundred = 100.00;

                if (percentage >= hundred) {
                    //receivedpercentage is 100
                    purchaseorderDao.updateCompleted(3, existingPOID);
                } else if (percentage < 100.00 && percentage > 0.00) {
                    purchaseorderDao.updatePOStatus(2, existingPOID);
                } else {
                    purchaseorderDao.updatePOStatus(1, existingPOID);
                }
            }
            grndao.save(grn);

        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(grn.getId()));
        response.put("url", "/grns/" + grn.getId());
        response.put("errors", errors);

        return response;

    }

    private String calcResourceLimit(Grnrawmaterial grnrm, Integer quantity, String currentRL) {
        String rmSize = grnrm.getRawmaterial().getMaterialcategory().getMcsize().getName();
        ExtractedData extractedData = extractParts(rmSize);
        BigDecimal rmLimit = extractedData.getNumber().multiply(new BigDecimal(quantity));
        String rmStr = extractedData.getText();
        BigDecimal currentRmLimitInt = extractParts(currentRL).getNumber();
        BigDecimal updateRlInt = rmLimit.add(currentRmLimitInt);
        String updatedRmLimit = updateRlInt + " " + rmStr;
        return updatedRmLimit;
    }

    public static ExtractedData extractParts(String input) {
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

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Grn grn) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";
        Grn extGrnOrder = grndao.findByMyId(grn.getId());
        if (extGrnOrder == null) errors = errors + "<br> GRN Does Not Exist";

        if (extGrnOrder != null) {
            try {
                extGrnOrder.getGrnrawmaterials().clear();
                grn.getGrnrawmaterials().forEach(newgrm -> {
                    newgrm.setGrn(extGrnOrder);
                    extGrnOrder.getGrnrawmaterials().add(newgrm);
                    newgrm.setGrn(extGrnOrder);
                });
                BeanUtils.copyProperties(grn, extGrnOrder, "id", "grnrawmaterials", "quantity");

                if (errors == "") {
                    Purchaseorder existingPO = purchaseorderDao.findByMyId(grn.getPurchaseorder().getId());
                    Integer existingPOID = grn.getPurchaseorder().getId();

                    //if GRN completed=.update rm and purchase order received

                    String currentGrnStatus = grndao.getGrnStatus(grn.getId());
                    if (Objects.equals(grn.getGrnstatus().getName(), "Completed"))  {

                        // Before the loop, collect all old quantities for raw materials
                        Map<Integer, Integer> oldQuantities = new HashMap<>();
                        for (Poitem poi : existingPO.getPoitems()) {
                            Integer idOfRm = poi.getRawmaterial().getId();
                            Integer oldQuantity = grndao.findGrnRmQuantity(idOfRm, grn.getId());
                            oldQuantities.put(idOfRm, oldQuantity);  // Cache oldQuantity for each Raw Material
                        }

                        for (Poitem poi : existingPO.getPoitems()) {
                            Integer idOfRm = poi.getRawmaterial().getId();
                            Integer oldQuantity = oldQuantities.get(idOfRm);
                            for (Grnrawmaterial grnrm : grn.getGrnrawmaterials()) {
                                if (Objects.equals(grnrm.getRawmaterial().getId(), idOfRm)) {
                                    //rm updates
                                    Integer quantity = grnrm.getQuantity();
                                    Integer diff = quantity - oldQuantity;


                                    //grn which is new and update as completed first time
                                    if (currentGrnStatus.equalsIgnoreCase("New")) {
                                        String currentRL2 = rawmaterialDao.findByMyId(idOfRm).getResourcelimit();
                                        String updatedResourceLimit2 = calcResourceLimit(grnrm, quantity, currentRL2);
                                        rawmaterialDao.updateRawMaterialQuantityAfterGrn(BigDecimal.valueOf(quantity), idOfRm);
                                        rawmaterialDao.updateRawMaterialResourceLimitAfterGrn(updatedResourceLimit2, idOfRm);

                                        //po update
                                        purchaseorderDao.updateExistingRMQuantity(quantity, idOfRm, existingPOID);
                                    } else {
                                        String currentRL = rawmaterialDao.findByMyId(idOfRm).getResourcelimit();
                                        String updatedResourceLimit = calcResourceLimit(grnrm, diff, currentRL);
                                        //rm update
                                        rawmaterialDao.updateRawMaterialQuantityAfterGrn(BigDecimal.valueOf(diff), idOfRm);
                                        rawmaterialDao.updateRawMaterialResourceLimitAfterGrn(updatedResourceLimit, idOfRm);
                                        //po update
                                        purchaseorderDao.updateExistingRMQuantity(diff, idOfRm, existingPOID);
                                    }

                                    //cal rm status
                                    BigDecimal ropafter = rawmaterialDao.findROPByMyId(idOfRm);
                                    BigDecimal qohafter = rawmaterialDao.findQOHByMyId(idOfRm);

                                    if (qohafter.compareTo(BigDecimal.ONE) <= 0) {
                                        // qohafter <= 1
                                        //mat status is 2 ; out of stock
                                        rawmaterialDao.updateRmStatusAfter(idOfRm, 2);
                                    } else if (qohafter.compareTo(ropafter) <= 0) {
                                        // qoh is less than or equal to rop
                                        //mat status is 3 ; need to stock
                                        rawmaterialDao.updateRmStatusAfter(idOfRm, 3);
                                    } else {
                                        // qoh is > to rop
                                        //mat status is 1 ; available
                                        rawmaterialDao.updateRmStatusAfter(idOfRm, 1);
                                    }
                                }
                            }

                            Integer totalamount = 0;
                            Integer completed = 0;
                            Purchaseorder epo = purchaseorderDao.findByMyId(grn.getPurchaseorder().getId());
                            completed = purchaseorderDao.findPOItemRMreceived(epo.getId());
                            totalamount = purchaseorderDao.findPOItemRmQuantity(epo.getId());
                            double percentage = ((double) completed / totalamount) * 100;
                            String formattedPercentage = String.format("%.2f", percentage);
                            double roundedPercentage = Double.parseDouble(formattedPercentage);
                            purchaseorderDao.updateReceivedPercentage(BigDecimal.valueOf(roundedPercentage), existingPOID);
//                        BigDecimal receivedpercentage = podao.getReceivedPercentage(epo.getId()).setScale(2, RoundingMode.HALF_UP);
                            double hundred = 100.00;

                            if (percentage >= hundred) {
                                // receivedpercentage is 100
                                purchaseorderDao.updateCompleted(1, existingPOID);
                            } else if (percentage < 100.00 && percentage > 0.00) {
                                purchaseorderDao.updatePOStatus(2, existingPOID);
                            } else {
                                purchaseorderDao.updatePOStatus(4, existingPOID);
                            }

//                        if (Objects.equals(podao.getReceivedPercentage(epo.getId()), new BigDecimal(100))) {
//                            podao.updateCompleted(1, existingPOID);
//                        }
                        }

                        grndao.save(extGrnOrder);
                    } else {
                        errors = "Server Validation Errors : <br> " + errors;
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        response.put("id", String.valueOf(grn.getId()));
        response.put("url", "/grns/" + grn.getId());
        response.put("errors", errors);

        return response;

    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Grn grn = grndao.findByMyId(id);

        if (grn == null) errors = errors + "<br> Grn Does Not Exist";

        if (errors == "") {
            Purchaseorder existingPO = purchaseorderDao.findByMyId(grn.getPurchaseorder().getId());
            Integer existingPOID = grn.getPurchaseorder().getId();

            for (Poitem poi : existingPO.getPoitems()) {
                Integer idOfRm = poi.getRawmaterial().getId();


                for (Grnrawmaterial grnrm : grn.getGrnrawmaterials()) {
                    if (grnrm.getRawmaterial().getId() == idOfRm) {

                        //rm update
                        String currentRL = rawmaterialDao.findByMyId(id).getResourcelimit();
                        Integer oldQuantity = -(grndao.findGrnRmQuantity(idOfRm, grn.getId()));
                        String updatedResourceLimit = calcResourceLimit(grnrm, oldQuantity, currentRL);

                        //rm updates
                        rawmaterialDao.updateRawMaterialQuantityAfterGrn(BigDecimal.valueOf(oldQuantity), idOfRm);
                        rawmaterialDao.updateRawMaterialResourceLimitAfterGrn(updatedResourceLimit, idOfRm);

                        //after cal rm status
                        BigDecimal ropafter = rawmaterialDao.findROPByMyId(idOfRm);
                        BigDecimal quhafter = rawmaterialDao.findQOHByMyId(idOfRm);

                        if (quhafter.compareTo(BigDecimal.ONE) <= 0) {
                            //qohafter<==1
                            //mat status is 3 ; out of stock
                            rawmaterialDao.updateRmStatusAfter(idOfRm, 2);
                        } else if (quhafter.compareTo(ropafter) <= 0) {
                            //qoh is less than or equal to rop
                            //mat status is 3 ; need to stock
                            rawmaterialDao.updateRmStatusAfter(idOfRm, 3);
                        } else {
                            //roq is> to rop
                            //mat status is 1; available
                            rawmaterialDao.updateRmStatusAfter(idOfRm, 1);
                        }

                        purchaseorderDao.updateExistingRMQuantity(oldQuantity, idOfRm, existingPOID);
                    }
                }
            }

            Integer totalamount = 0;
            Integer completed = 0;

            Purchaseorder epo = purchaseorderDao.findByMyId(grn.getPurchaseorder().getId());
            completed = purchaseorderDao.findPOItemRMreceived(epo.getId());
            totalamount = purchaseorderDao.findPOItemRmQuantity(epo.getId());
            double percentage = ((double) completed / totalamount) * 100;
            String formattedPercentage = String.format("%.2f", percentage);
            double roundedPercentage = Double.parseDouble(formattedPercentage);
            purchaseorderDao.updateReceivedPercentage(BigDecimal.valueOf(roundedPercentage), existingPOID);


            //purchase order status update according to received percentage
            BigDecimal receivedPercentage = purchaseorderDao.getReceivedPercentage(epo.getId()).setScale(2, RoundingMode.HALF_UP);
            double hundred = 100.00;

            if (percentage >= hundred) {
                //receivedpercentage is 100
                purchaseorderDao.updateCompleted(3, existingPOID);
            } else if (percentage < 100.00 && percentage > 0.00) {
                purchaseorderDao.updatePOStatus(2, existingPOID);
            } else {
                purchaseorderDao.updatePOStatus(1, existingPOID);
            }

            grndao.delete(grn);
        }

            else errors = "Server Validation Errors : <br> " + errors;

            responce.put("id", String.valueOf(id));
            responce.put("url", "/grns/" + id);
            responce.put("errors", errors);

            return responce;
        }

    }
