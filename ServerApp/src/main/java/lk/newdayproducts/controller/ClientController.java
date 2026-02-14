package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ClientDao;
import lk.newdayproducts.entity.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/clients")
public class ClientController {

    @Autowired
    private ClientDao clientdao;


    @GetMapping(produces = "application/json")
    public List<Client> get() {

        List<Client> clients = this.clientdao.findAll();

        clients = clients  .stream().map(
                client -> {
                    Client c = new Client();
                    c.setId(client.getId());
                    c.setState(client.getState());
                    c.setName(client.getName());
                    c.setAddress(client.getAddress());
                    c.setTelephone(client.getTelephone());
                    c.setEmail(client.getEmail());
                    c.setClientstatus(client.getClientstatus());
                    c.setDoregister(client.getDoregister());
                    c.setEmployeeEntered(client.getEmployeeEntered());
                    return c;
                }
        ).collect(Collectors.toList());
//        materialcategories.forEach(materialcategory -> {
//            System.out.println(materialcategory.toString());
//
//        });
        return clients;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Client client) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

//        if (clientdao.findByCode(rawmaterial.getCode()) != null)
//            errors = errors + "<br> Existing Raw Material";
//
//        if (errors == "")
//            rawmaterialdao.save(rawmaterial);
//        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(client.getId()));
        responce.put("url", "/clients/" + client.getId());
        responce.put("errors", errors);

        return responce;
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Client client) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

       Client c = clientdao.findByMyId(client.getId());

        if (c != null && !(client.getId().equals(c.getId())))
            errors = errors + "<br> Not existing";


        if (errors == "") clientdao.save(client);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(client.getId()));
        responce.put("url", "/clients/" + client.getId());
        responce.put("errors", errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Client c = clientdao.findByMyId(id);

        if (c == null) errors = errors + "<br> Client Does Not Exist";

        if (errors.isEmpty()) clientdao.delete(c);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/clients/" + id);
        responce.put("errors", errors);

        return responce;
    }

}