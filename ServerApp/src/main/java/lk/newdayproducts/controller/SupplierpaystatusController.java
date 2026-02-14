package lk.newdayproducts.controller;

import lk.newdayproducts.dao.EmptypeDao;
import lk.newdayproducts.dao.SupplierpaystatusDao;
import lk.newdayproducts.entity.Emptype;
import lk.newdayproducts.entity.Supplierpaystatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/supplierpaystatuses")
public class SupplierpaystatusController {

    @Autowired
    private SupplierpaystatusDao supplierpaystatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Supplierpaystatus> get() {

        List<Supplierpaystatus> supplierpaystatuses = this.supplierpaystatusdao.findAll();

        supplierpaystatuses = supplierpaystatuses.stream().map(
                supplierpaystatus -> { Supplierpaystatus s = new Supplierpaystatus();
                    s.setId(supplierpaystatus.getId());
                    s.setName(supplierpaystatus.getName());
                    return s; }
        ).collect(Collectors.toList());

        return supplierpaystatuses;

    }

}


