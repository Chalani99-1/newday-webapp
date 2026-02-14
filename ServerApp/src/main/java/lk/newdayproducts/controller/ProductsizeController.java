package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ProductsizeDao;
import lk.newdayproducts.entity.Productsize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/productsizes")
public class ProductsizeController {

    @Autowired
    private ProductsizeDao productsizedao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Productsize> get() {

        List<Productsize> productsizes = this.productsizedao.findAll();

        productsizes = productsizes.stream().map(
                productsize -> { Productsize p = new Productsize();
                    p.setId(productsize.getId());
                    p.setName(productsize.getName());
                    return p; }
        ).collect(Collectors.toList());

        return productsizes;

    }

}


