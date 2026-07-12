package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ClientDao;
import lk.newdayproducts.dao.ClientorderDao;
import lk.newdayproducts.dao.InvoiceDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.entity.Client;
import lk.newdayproducts.entity.Clientorder;
import lk.newdayproducts.entity.Invoice;
import lk.newdayproducts.entity.Rawmaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@CrossOrigin
@RestController
@RequestMapping(value = "/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceDao invoicedao;

    @Autowired
    private ClientorderDao clientorderDao;

    @Autowired
    private ClientDao clentDao;
    @Autowired
    private ClientDao clientDao;

//    @GetMapping(path = "/number", produces = "application/json")
//    public ResponseEntity<Integer> get() {
//        int maxid = this.invoicedao.findMaxNumber();
//        if (maxid == 0) maxid = 1;
//        return ResponseEntity.ok().body(maxid);
//    }

    @GetMapping(path = "/number", produces = "application/json")
    public ResponseEntity<Map<String, String>> get() {
        int maxid = this.invoicedao.findMaxNumber();
        if (maxid == 0) maxid = 1;
        Map<String, String> response = new HashMap<>();
        response.put("number", ""+maxid);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping(produces = "application/json")
    public List<Invoice> get(@RequestParam HashMap<String, String> params) {

        List<Invoice> invoices = this.invoicedao.findAll();

        if (params.isEmpty()) return invoices;

        String number = params.get("number");
        String date = params.get("date");
        String invoicestatusid = params.get("invoicestatusid");

        Stream<Invoice> istream = invoices.stream();

        if (number != null) istream = istream.filter((i) -> i.getNumber().equals(number));
        if (date != null) istream = istream.filter((i) -> i.getDate().toString().equals(date));
        if (invoicestatusid != null)
            istream = istream.filter((i) -> i.getInvoicestatus().getId() == Integer.parseInt(invoicestatusid));

        return istream.collect(Collectors.toList());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Invoice invoice) {

        HashMap<String, String> response = new HashMap<>();

        String errors = "";

        if (this.invoicedao.findByMyId(invoice.getId()) != null) errors = errors + "<br> Existing Invoice";

        if (errors == "") {
            List<Clientorder> clientorders = clientorderDao.findAll();
            List<Client> clients = clientDao.findAll();

            for (Client client : clients) {
                    int count=0;
                for (Clientorder clientorder : clientorders) {
                    if(client.getId().equals(clientorder.getClient().getId())) {
                        count++;
                    }
                }

                if(count>=2){
                    invoice.setGrandtotal(invoice.getGrandtotal().multiply(new BigDecimal(0.9)));
                }

            }

            this.invoicedao.save(invoice);
        } else {
            errors = errors + "<br> Server Validation Errors :";
        }

        response.put("id", String.valueOf(invoice.getId()));
        response.put("url", "/invoices/" + invoice.getId());
        response.put("errors", errors);

        return response;

    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)

    public HashMap<String, String> update(@RequestBody Invoice invoice) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Invoice i = invoicedao.findByMyId(invoice.getId());

        if (i != null && !(invoice.getId().equals(i.getId())))
            errors = errors + "<br> Not existing";


        if (errors == "") invoicedao.save(invoice);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(invoice.getId()));
        responce.put("url", "/invoices/" + invoice.getId());
        responce.put("errors", errors);

        return responce;
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> delete(@PathVariable Integer id) {

        // System.out.println(id);

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

        Invoice i = invoicedao.findByMyId(id);

        if (i == null) errors = errors + "<br> Invoice Does Not Exist";

        if (errors.isEmpty()) invoicedao.delete(i);
        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(id));
        responce.put("url", "/invoices/" + id);
        responce.put("errors", errors);

        return responce;
    }

}