package lk.newdayproducts.controller;

import lk.newdayproducts.dao.InvoiceDao;
import lk.newdayproducts.dao.RawmaterialDao;
import lk.newdayproducts.entity.Invoice;
import lk.newdayproducts.entity.Rawmaterial;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceDao invoicedao;


    @GetMapping(produces = "application/json")
    public List<Invoice> get() {

        List<Invoice> invoices = this.invoicedao.findAll();

        invoices = invoices  .stream().map(invoice -> {
                    Invoice i = new Invoice();
                    i.setId(invoice.getId());
                    i.setNumber(invoice.getNumber());
                    i.setDate(invoice.getDate());
                    i.setInvoicestatus(invoice.getInvoicestatus());
                    i.setClientorder(invoice.getClientorder());
                    i.setGrandtotal(invoice.getGrandtotal());
                    i.setPaymentref(invoice.getPaymentref());
                    i.setReceipt(invoice.getReceipt());
                    i.setDescription(invoice.getDescription());
                    i.setPaytype(invoice.getPaytype());
                    i.setEmployee(invoice.getEmployee());
                    return i;
                }
        ).collect(Collectors.toList());
//        materialcategories.forEach(materialcategory -> {
//            System.out.println(materialcategory.toString());
//
//        });
        return invoices;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HashMap<String, String> add(@RequestBody Invoice invoice) {

        HashMap<String, String> responce = new HashMap<>();
        String errors = "";

//        if (rawmaterialdao.findByCode(rawmaterial.getCode()) != null)
//            errors = errors + "<br> Existing Raw Material";
//
//        if (errors == "")
//            rawmaterialdao.save(rawmaterial);
//        else errors = "Server Validation Errors : <br> " + errors;

        responce.put("id", String.valueOf(invoice.getId()));
        responce.put("url", "/invoices/" + invoice.getId());
        responce.put("errors", errors);

        return responce;
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