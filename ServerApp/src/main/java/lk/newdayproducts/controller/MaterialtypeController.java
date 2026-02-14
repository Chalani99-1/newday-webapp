package lk.newdayproducts.controller;

import lk.newdayproducts.dao.MaterialtypeDao;
import lk.newdayproducts.entity.Materialtype;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/materialtypes")
public class MaterialtypeController {

    @Autowired
    private MaterialtypeDao materialtypedao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Materialtype> get() {

        List<Materialtype> materialtypes = this.materialtypedao.findAll();

        materialtypes = materialtypes.stream().map(
                materialtype -> { Materialtype m = new Materialtype();
                    m.setId(materialtype.getId());
                    m.setName(materialtype.getName());
                    return m; }
        ).collect(Collectors.toList());

        return materialtypes;

    }

}


