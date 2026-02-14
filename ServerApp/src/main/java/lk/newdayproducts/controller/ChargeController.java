package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ChargeDao;
import lk.newdayproducts.dao.EmptypeDao;
import lk.newdayproducts.entity.Charge;
import lk.newdayproducts.entity.Emptype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/charges")
public class ChargeController {

    @Autowired
    private ChargeDao chargedao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Charge> get() {

        List<Charge> charges = this.chargedao.findAll();

        charges = charges.stream().map(
                charge -> { Charge c = new Charge();
                    c.setId(charge.getId());
                    c.setPercentage(charge.getPercentage());
                    return c; }
        ).collect(Collectors.toList());

        return charges;

    }

}


