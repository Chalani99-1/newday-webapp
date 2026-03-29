package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ProductDao;
import lk.newdayproducts.dao.ProductionorderDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.entity.Productionorder;
import lk.newdayproducts.entity.Productionorderproduct;
import lk.newdayproducts.entity.Rawmaterial;
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
@RequestMapping(value = "/productionorders")
public class ProductionorderController {

    @Autowired
    private ProductionorderDao productionorderdao;

    @Autowired
    private RawmaterialDao rawmaterialDao;

    @Autowired
    private ProductDao productDao;


//    @GetMapping(path = "/ number", produces = "application/json")
//    public ResponseEntity<Integer> get() {
//        int maxid = this.productionorderdao.findMaxNumber();
//        if (maxid == 0) maxid = 1;
//        return ResponseEntity.ok().body(maxid);
//    }

    @GetMapping(path = "/number", produces = "application/json")
    public ResponseEntity<Map<String, String>> get() {
        int maxid = this.productionorderdao.findMaxNumber();
        if (maxid == 0) maxid = 1;
        Map<String, String> response = new HashMap<>();
        response.put("number", "" + maxid);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping(produces = "application/json")
    public List<Productionorder> get(@RequestParam HashMap<String, String> params) {


        List<Productionorder> productionorders = this.productionorderdao.findAll();

        String employeeid = params.get("employeeid");
        String doplaced = params.get("doplaced");
        String dorequired = params.get("dorequired");
        String ordernumber = params.get("ordernumber");


        List<Productionorder> porders = this.productionorderdao.findAll();

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

        for (Productionorderproduct po : order.getProductionorderproducts()) po.setProductionorder(order);

        if (productionorderdao.findbyNumber(order.getOrdernumber()) != null)
            errors = errors + "<br> Existing Order";

        if (errors == "") {
            productionorderdao.save(order);

        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(order.getId()));
        response.put("url", "/productionorders/" + order.getId());
        response.put("errors", errors);

        return response;

    }

      @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Productionorder order) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";

        Productionorder extPOrder = productionorderdao.findByMyId(order.getId());
        if (extPOrder == null) errors = errors + "<br> Production Order Does Not Exist";

        if (errors == "") {
            productionorderdao.save(extPOrder); // Save the updated extUser object
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }


        response.put("id", String.valueOf(order.getId()));
        response.put("url", "/productionorders/" + order.getId());
        response.put("errors", errors);

        return response;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Productionorder p = productionorderdao.findByMyId(id);

        if (p == null) errors = errors + "<br> Production Order Does Not Exist";

        if (errors.isEmpty()) productionorderdao.delete(p);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/productionorders/" + id);
        responce.put("errors", errors);

        return responce;
    }

}