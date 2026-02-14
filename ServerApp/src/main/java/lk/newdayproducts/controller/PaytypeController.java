package lk.newdayproducts.controller;

import lk.newdayproducts.dao.EmptypeDao;
import lk.newdayproducts.dao.PaytypeDao;
import lk.newdayproducts.entity.Emptype;
import lk.newdayproducts.entity.Paytype;
import org.hibernate.validator.internal.constraintvalidators.bv.time.past.PastValidatorForYearMonth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/paytypes")
public class PaytypeController {

    @Autowired
    private PaytypeDao paytypedao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Paytype> get() {

        List<Paytype> paytypes = this.paytypedao.findAll();

        paytypes = paytypes.stream().map(
                paytype -> { Paytype p = new Paytype();
                    p.setId(paytype.getId());
                    p.setName(paytype.getName());
                    return p; }
        ).collect(Collectors.toList());

        return paytypes;

    }

}


