package lk.newdayproducts.controller;

import lk.newdayproducts.dao.EmptypeDao;
import lk.newdayproducts.dao.SuppliermaterialcateoryDao;
import lk.newdayproducts.entity.Emptype;
import lk.newdayproducts.entity.Materialcategory;
import lk.newdayproducts.entity.Suppliermaterialcategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/suppliermaterialcategories")
public class SuppliermaterialcategoryController {

    @Autowired
    private SuppliermaterialcateoryDao suppliermaterialcateorydao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Suppliermaterialcategory> get() {

        List<Suppliermaterialcategory> suppliermaterialcategories = this.suppliermaterialcateorydao.findAll();

        suppliermaterialcategories = suppliermaterialcategories.stream().map(
                suppliermaterialcategory -> { Suppliermaterialcategory s = new Suppliermaterialcategory();
                    s.setId(suppliermaterialcategory.getId());
                    s.setSupplier(suppliermaterialcategory.getSupplier());
                    s.setMaterialcategory(suppliermaterialcategory.getMaterialcategory());
                    return s; }
        ).collect(Collectors.toList());

        return suppliermaterialcategories;

    }

}


