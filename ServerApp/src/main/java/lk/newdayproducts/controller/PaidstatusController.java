package lk.newdayproducts.controller;

import lk.newdayproducts.dao.PaidstatusDao;
import lk.newdayproducts.entity.Paidstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/paidstatuses")
public class PaidstatusController {

    @Autowired
    private PaidstatusDao paidstatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Paidstatus> get() {

        List<Paidstatus> paidstatuses = this.paidstatusdao.findAll();

        paidstatuses = paidstatuses.stream().map(
                paidstatus -> { Paidstatus p = new Paidstatus();
                    p.setId(paidstatus.getId());
                    p.setName(paidstatus.getName());
                    return p; }
        ).collect(Collectors.toList());

        return paidstatuses;

    }

}


