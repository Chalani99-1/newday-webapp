package lk.newdayproducts.controller;

import lk.newdayproducts.dao.EmptypeDao;
import lk.newdayproducts.dao.MaterialstatusDao;
import lk.newdayproducts.entity.Emptype;
import lk.newdayproducts.entity.Materialstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/materialstatuses")
public class MaterialstatusController {

    @Autowired
    private MaterialstatusDao materialstatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Materialstatus> get() {

        List<Materialstatus> materialstatuses = this.materialstatusdao.findAll();

        materialstatuses = materialstatuses.stream().map(
                materialstatus -> { Materialstatus m = new Materialstatus();
                    m.setId(materialstatus.getId());
                    m.setName(materialstatus.getName());
                    return m; }
        ).collect(Collectors.toList());

        return materialstatuses;

    }

}


