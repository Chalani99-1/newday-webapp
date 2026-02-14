package lk.newdayproducts.controller;

import lk.newdayproducts.dao.EmptypeDao;
import lk.newdayproducts.dao.InvoicestatusDao;
import lk.newdayproducts.entity.Emptype;
import lk.newdayproducts.entity.Invoicestatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/invoicestatuses")
public class InvoicestatusController {

    @Autowired
    private InvoicestatusDao invoicestatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Invoicestatus> get() {

        List<Invoicestatus> invoicestatuses = this.invoicestatusdao.findAll();

        invoicestatuses = invoicestatuses.stream().map(
                invoicestatus -> { Invoicestatus i = new Invoicestatus();
                    i.setId(invoicestatus.getId());
                    i.setName(invoicestatus.getName());
                    return i; }
        ).collect(Collectors.toList());

        return invoicestatuses;

    }

}


