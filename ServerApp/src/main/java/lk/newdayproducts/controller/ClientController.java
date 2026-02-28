package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ClientDao;
import lk.newdayproducts.entity.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/clients")
public class ClientController {

    @Autowired
    private ClientDao clientdao;


    @GetMapping(produces = "application/json")
    public List<Client> get(@RequestParam HashMap<String, String> params) {

        List<Client> clientList = this.clientdao.findAll();
        if (params.isEmpty()) return clientList;

        String clientname = params.get("name");
        String statusId = params.get("statusId");
        String stateid = params.get("stateid");

        Stream<Client> stream = clientList.stream();
        if (clientname != null) stream = stream.filter(s -> s.getName().toLowerCase().contains(clientname));
        if (statusId != null) stream = stream.filter(s -> s.getClientstatus().getId()== Integer.parseInt(statusId));
        if (stateid != null) stream = stream.filter(s -> s.getState().getId()==Integer.parseInt(stateid));

        return stream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Client client) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        if(clientdao.findByName(client.getName())!=null)
            errors = errors+"<br> Existing Name";

        if(errors=="")
            clientdao.save(client);
        else errors = "Server Validation Errors : <br> "+errors;


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