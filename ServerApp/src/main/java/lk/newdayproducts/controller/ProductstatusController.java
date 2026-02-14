package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ProductstatusDao;
import lk.newdayproducts.entity.Productstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/productstatuses")
public class ProductstatusController {

    @Autowired
    private ProductstatusDao productstatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Productstatus> get() {

        List<Productstatus> productstatuses = this.productstatusdao.findAll();

        productstatuses = productstatuses.stream().map(
                productstatus -> { Productstatus p = new Productstatus();
                    p.setId(productstatus.getId());
                    p.setName(productstatus.getName());
                    return p; }
        ).collect(Collectors.toList());

        return productstatuses;

    }

}


