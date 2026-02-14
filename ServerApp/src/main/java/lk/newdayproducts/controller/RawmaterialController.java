package lk.newdayproducts.controller;

import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.entity.Materialcategory;
import lk.newdayproducts.entity.Rawmaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/rawmaterials")
public class RawmaterialController {

    @Autowired
    private RawmaterialDao rawmaterialdao;

    @GetMapping(path = "/maxnumber", produces = "application/json")
    public ResponseEntity<Integer> get() {
        int maxid = this.rawmaterialdao.findMaxNumber();
        if (maxid == 0) maxid = 1;
        return ResponseEntity.ok().body(maxid);
    }

    @GetMapping(produces = "application/json")
    public List<Rawmaterial> get(@RequestParam HashMap<String, String> params) {

        List<Rawmaterial> rawmaterialList = this.rawmaterialdao.findAll();
        if (params.isEmpty()) return rawmaterialList;

        String rawmaterialname = params.get("name");
        String rawmaterialcode = params.get("code");
        String materialcategory = params.get("category");
        String materialtype = params.get("type");
        String materialstatus = params.get("status");


        Stream<Rawmaterial> stream = rawmaterialList.stream();
        if (rawmaterialname != null) stream = stream.filter(s -> s.getName().toLowerCase().contains(rawmaterialname));
        if (rawmaterialcode != null) stream = stream.filter(s -> s.getCode().toLowerCase().contains(rawmaterialcode));
        if (materialtype != null) stream = stream.filter(s -> s.getMaterialtype().getId().toString().equals(materialtype));
        if (materialcategory != null)
            stream = stream.filter(s -> s.getMaterialcategory().getId().toString().equals(materialcategory));
        if (materialstatus != null)
            stream = stream.filter(s -> s.getMaterialstatus().getId().toString().equals(materialstatus));


        return stream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Rawmaterial rawmaterial) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        if (rawmaterialdao.findByCode(rawmaterial.getCode()) != null)
            errors = errors + "<br> Existing Raw Material";

        if (errors == "")
            rawmaterialdao.save(rawmaterial);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(rawmaterial.getId()));
        responce.put("url", "/rawmaterials/" + rawmaterial.getId());
        responce.put("errors", errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> update(@RequestBody Rawmaterial rawmaterial) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Rawmaterial rm = rawmaterialdao.findByMyId(rawmaterial.getId());

        if (rm != null && !(rawmaterial.getId().equals(rm.getId())))
            errors = errors + "<br> Not existing";


        if (errors == "") rawmaterialdao.save(rawmaterial);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(rawmaterial.getId()));
        responce.put("url", "/rawmaterials/" + rawmaterial.getId());
        responce.put("errors", errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Rawmaterial rm = rawmaterialdao.findByMyId(id);

        if (rm == null) errors = errors + "<br> Raw Material Does Not Exist";

        if (errors.isEmpty()) rawmaterialdao.delete(rm);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/rawmaterials/" + id);
        responce.put("errors", errors);

        return responce;
    }

}