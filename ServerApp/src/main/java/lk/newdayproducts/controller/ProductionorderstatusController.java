package lk.newdayproducts.controller;

import lk.newdayproducts.dao.EmptypeDao;
import lk.newdayproducts.dao.ProductionorderstatusDao;
import lk.newdayproducts.entity.Emptype;
import lk.newdayproducts.entity.Productionorderstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/productionorderstatuses")
public class ProductionorderstatusController {

    @Autowired
    private ProductionorderstatusDao productionorderstatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Productionorderstatus> get() {

        List<Productionorderstatus> productionorderstatuses = this.productionorderstatusdao.findAll();

        productionorderstatuses = productionorderstatuses.stream().map(
                productionorderstatus -> { Productionorderstatus p = new Productionorderstatus();
                    p.setId(productionorderstatus.getId());
                    p.setName(productionorderstatus.getName());
                    return p; }
        ).collect(Collectors.toList());

        return productionorderstatuses;

    }

}


