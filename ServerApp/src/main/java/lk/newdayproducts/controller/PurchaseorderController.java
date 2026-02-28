package lk.newdayproducts.controller;

import lk.newdayproducts.dao.PurchaseorderDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.entity.Poitem;
import lk.newdayproducts.entity.Purchaseorder;
import lk.newdayproducts.entity.Rawmaterial;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/purchaseorders")
public class PurchaseorderController {

    @Autowired
    private RawmaterialDao rawmaterialdao;

    @Autowired
    private PurchaseorderDao purchaseorderdao;

    @GetMapping(path = "/number", produces = "application/json")
    public ResponseEntity<Map<String, String>> get() {
        int maxid = this.purchaseorderdao.findMaxNumber();
        if (maxid == 0) maxid = 1;
        Map<String, String> response = new HashMap<>();
        response.put("number", ""+maxid);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping(produces = "application/json")
    public List<Purchaseorder> get(@RequestParam HashMap<String, String> params){

        String supplierid = params.get("supplierid");
        String doplaced = params.get("doplaced");


        List<Purchaseorder> porders = this.purchaseorderdao.findAll();

        if (params.isEmpty()) return porders;

        Stream<Purchaseorder> postream = porders.stream();

        if (supplierid!=null) postream = postream.filter(o -> o.getSupplier().getId() ==Integer.parseInt(supplierid)) ;
        if (doplaced!=null) postream = postream.filter (o -> o.getDoplaced().toString().contains(doplaced));

        return postream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Purchaseorder order) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";
        for (Poitem po : order.getPoitems()) po.setPurchaseorder(order);
        //find if already existed
        if (purchaseorderdao.findbyNumber(order.getNumber()) != null)
            errors = errors + "<br> Existing Order";
        //save order if no errors
        if (errors == "") {purchaseorderdao.save(order);}
        else { errors = "Server Validation Errors : <br> " + errors;}

        response.put("id", String.valueOf(order.getId()));
        response.put("url", "/purchaseorders/" + order.getId());
        response.put("errors", errors);
        return response;

    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Purchaseorder order) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";
        Purchaseorder extPOrder = purchaseorderdao.findByMyId(order.getId());
        if (extPOrder == null) errors = errors + "<br> Order Does Not Exist";

        if (extPOrder != null) {
            try {
                extPOrder.getPoitems().clear();
                order.getPoitems().forEach(newpoitem -> {
                    newpoitem.setPurchaseorder(extPOrder);
                    extPOrder.getPoitems().add(newpoitem);
                    newpoitem.setPurchaseorder(extPOrder);
                });

                BeanUtils.copyProperties(order, extPOrder, "id","poitems","qty");

                if (errors == "") {
                    purchaseorderdao.save(extPOrder);
                } else {
                    errors = "Server Validation Errors : <br> " + errors;
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        response.put("id", String.valueOf(order.getId()));
        response.put("url", "/purchaseorders/" + order.getId());
        response.put("errors", errors);

        return response;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String,String> delete(@PathVariable Integer id){

        HashMap<String,String> responce = new HashMap<>();
        String errors="";

        Purchaseorder ord = purchaseorderdao.findByMyId(id);

        if(ord==null)
            errors = errors+"<br> Purchase Order Does Not Exists";

        if(errors=="") purchaseorderdao.delete(ord);
        else errors = "Server Validation Errors : <br> "+errors;

        responce.put("code",String.valueOf(id));
        responce.put("url","/id/"+id);
        responce.put("errors",errors);

        return responce;
    }

}