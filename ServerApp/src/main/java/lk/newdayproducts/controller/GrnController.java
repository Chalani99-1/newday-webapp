package lk.newdayproducts.controller;

import lk.newdayproducts.dao.GrnDao;
import lk.newdayproducts.dao.PurchaseorderDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.entity.*;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Grn grn) {
        HashMap<String, String> response = new HashMap<>();
        String errors = "";
        for (Grnrawmaterial grm : grn.getGrnrawmaterials()) {
            grm.setGrn(grn);
        }
        if (grndao.findByNumber(grn.getNumber()) != null) errors = errors + "<br> Existing GRN";
        if (errors == "") {
            grndao.save(grn);
        } else {
            errors = "Server Validation Errors : <br> " + errors;
        }

        response.put("id", String.valueOf(grn.getId()));
        response.put("url", "/grns/" + grn.getId());
        response.put("errors", errors);

        return response;

    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Grn grn) {

        HashMap<String, String> response = new HashMap<>();
        String errors = "";
        Grn extGrn = grndao.findByMyId(grn.getId());
        if (extGrn == null) errors = errors + "<br> GRN Does Not Exist";

        if (extGrn != null) {
                    grndao.save(extGrn);
                } else {
                    errors = "Server Validation Errors : <br> " + errors;
                }

        response.put("id",String.valueOf(grn.getId()));
        response.put("url","/grns/"+grn.getId());
        response.put("errors",errors);

        return response;

    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Grn g = grndao.findByMyId(id);

        if (g == null) errors = errors + "<br> Grn Does Not Exist";

        if (errors.isEmpty()) grndao.delete(g);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/grns/" + id);
        responce.put("errors", errors);

        return responce;
    }

}