package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ClientorderDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.entity.Clientorder;
import lk.newdayproducts.entity.Rawmaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/clientorders")
public class ClientorderController {

    @Autowired
    private ClientorderDao clientorderdao;


    @GetMapping(produces = "application/json")
    public List<Clientorder> get() {

        List<Clientorder> clientorders = this.clientorderdao.findAll();

        clientorders = clientorders  .stream().map(clientorder -> {
                    Clientorder c = new Clientorder();
                    c.setId(clientorder.getId());
                    c.setClient(clientorder.getClient());
                    c.setNumber(clientorder.getNumber());
                    c.setDoexpected(clientorder.getDoexpected());
                    c.setExpectedtotal(clientorder.getExpectedtotal());
                    c.setClientorderstatus(clientorder.getClientorderstatus());
                    c.setDescription(clientorder.getDescription());
                    c.setAdvancedpay(clientorder.getAdvancedpay());
                    c.setReceipt(clientorder.getReceipt());
                    c.setEmployee(clientorder.getEmployee());
                    c.setDoplaced(clientorder.getDoplaced());
                    c.setCompletepercentage(clientorder.getCompletepercentage());
                    c.setPaidstatus(clientorder.getPaidstatus());
                    return c;
                }
        ).collect(Collectors.toList());
//        materialcategories.forEach(materialcategory -> {
//            System.out.println(materialcategory.toString());
//
//        });
        return clientorders;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Clientorder clientorder) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

//        if (rawmaterialdao.findByCode(rawmaterial.getCode()) != null)
//            errors = errors + "<br> Existing Raw Material";
//
//        if (errors == "")
//            rawmaterialdao.save(rawmaterial);
//        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(clientorder.getId()));
        responce.put("url", "/clientorders/" + clientorder.getId());
        responce.put("errors", errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Clientorder clientorder) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Clientorder c = clientorderdao.findByMyId(clientorder.getId());

        if (c != null && !(clientorder.getId().equals(c.getId())))
            errors = errors + "<br> Not existing";


        if (errors == "") clientorderdao.save(clientorder);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(clientorder.getId()));
        responce.put("url", "/clientorders/" + clientorder.getId());
        responce.put("errors", errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Clientorder c = clientorderdao.findByMyId(id);

        if (c == null) errors = errors + "<br> Client Does Not Exist";

        if (errors.isEmpty()) clientorderdao.delete(c);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/clientorders/" + id);
        responce.put("errors", errors);

        return responce;
    }

}