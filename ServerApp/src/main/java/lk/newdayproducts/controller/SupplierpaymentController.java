package lk.newdayproducts.controller;

import lk.newdayproducts.dao.PurchaseorderDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.dao.SupplierpaymentDao;
import lk.newdayproducts.entity.Purchaseorder;
import lk.newdayproducts.entity.Rawmaterial;
import lk.newdayproducts.entity.Supplierpayment;
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
@RequestMapping(value = "/supplierpayments")
public class SupplierpaymentController {

    @Autowired
    private SupplierpaymentDao supplierpaymentdao;

    @Autowired
    private PurchaseorderDao purchaseorderDao;

//    @GetMapping(path = "/number", produces = "application/json")
//    public ResponseEntity<Integer> get() {
//        int maxid = this.supplierpaymentdao.findMaxNumber();
//        if (maxid == 0) maxid = 1;
//        return ResponseEntity.ok().body(maxid);
//    }

    @GetMapping(path = "/number", produces = "application/json")
    public ResponseEntity<Map<String, String>> get() {
        int maxid = this.supplierpaymentdao.findMaxNumber();
        if (maxid == 0) maxid = 1;
        Map<String, String> response = new HashMap<>();
        response.put("number", "" + maxid);
        return ResponseEntity.ok().body(response);
    }
    @GetMapping(produces = "application/json")
    public List<Supplierpayment> get(@RequestParam HashMap<String, String> params) {

        String poid = params.get("poid");
        String employeeid = params.get("employeeid");
        String paytypeid = params.get("paytypeid");

        List<Supplierpayment> supplierpayments = this.supplierpaymentdao.findAll();

        if (params.isEmpty()) return supplierpayments;

        Stream<Supplierpayment> postream = supplierpayments.stream();

        if (poid != null) postream = postream.filter(o -> o.getPurchaseorder().getId() == Integer.parseInt(poid));
        if (paytypeid != null)
            postream = postream.filter(o -> o.getSupplierpaystatus().getId() == Integer.parseInt(paytypeid));
        if (employeeid != null) postream = postream.filter(o -> o.getEmployee().toString().contains(employeeid));

        return postream.collect(Collectors.toList());

    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Supplierpayment sp) {
        HashMap<String, String> response = new HashMap<>();

        String errors = "";

        if (supplierpaymentdao.findbyNumber(sp.getNumber()) != null)
            errors = errors + "<br> Existing Supplier Payment Number";

        if (errors == "") {
            Purchaseorder existingPO = purchaseorderDao.findByMyId(sp.getPurchaseorder().getId());
            //po updates
            if (sp.getSupplierpaystatus().getId() == 1) {
                //when status completed
                Integer poid = sp.getPurchaseorder().getId();
                purchaseorderDao.updatePaid(1, poid);
            }
            supplierpaymentdao.save(sp);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(sp.getId()));
        response.put("url", "/supplierpayments/" + sp.getId());
        response.put("errors", errors);

        return response;

    }
    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Supplierpayment supplierpayment) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Supplierpayment s = supplierpaymentdao.findByMyId(supplierpayment.getId());

        if (s != null && !(supplierpayment.getId().equals(s.getId())))
            errors = errors + "<br> Not existing";


        if (errors == "") supplierpaymentdao.save(supplierpayment);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(supplierpayment.getId()));
        responce.put("url", "/supplierpayments/" + supplierpayment.getId());
        responce.put("errors", errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Supplierpayment s = supplierpaymentdao.findByMyId(id);

        if (s == null) errors = errors + "<br> Supplier Payment Does Not Exist";

        if (errors.isEmpty()) supplierpaymentdao.delete(s);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/supplierpayments/" + id);
        responce.put("errors", errors);

        return responce;
    }

}