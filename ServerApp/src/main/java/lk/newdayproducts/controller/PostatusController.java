package lk.newdayproducts.controller;

import lk.newdayproducts.dao.EmptypeDao;
import lk.newdayproducts.dao.PostatusDao;
import lk.newdayproducts.entity.Emptype;
import lk.newdayproducts.entity.Postatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/postatuses")
public class PostatusController {

    @Autowired
    private PostatusDao postatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Postatus> get() {

        List<Postatus> postatuses = this.postatusdao.findAll();

        postatuses = postatuses.stream().map(
                postatus -> { Postatus p = new Postatus();
                    p.setId(postatus.getId());
                    p.setName(postatus.getName());
                    return p; }
        ).collect(Collectors.toList());

        return postatuses;

    }

}


