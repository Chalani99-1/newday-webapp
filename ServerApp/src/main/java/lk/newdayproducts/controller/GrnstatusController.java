package lk.newdayproducts.controller;

import lk.newdayproducts.dao.GrnstatusDao;
import lk.newdayproducts.entity.Grnstatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/grnstatuses")
public class GrnstatusController {

    @Autowired
    private GrnstatusDao grnstatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Grnstatus> get() {

        List<Grnstatus> grnstatuses = this.grnstatusdao.findAll();

        grnstatuses = grnstatuses.stream().map(
                grnstatus -> { Grnstatus g = new Grnstatus();
                    g.setId(grnstatus.getId());
                    g.setName(grnstatus.getName());
                    return g; }
        ).collect(Collectors.toList());

        return grnstatuses;

    }

}


