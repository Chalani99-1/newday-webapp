package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ClientorderstatusDao;
import lk.newdayproducts.dao.EmptypeDao;
import lk.newdayproducts.entity.Clientorderstatus;
import lk.newdayproducts.entity.Clientstatus;
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
@RequestMapping(value = "/clientorderstatuses")
public class ClientorderstatusController {

    @Autowired
    private ClientorderstatusDao clientorderstatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Clientorderstatus> get() {

        List<Clientorderstatus> clientorderstatuses = this.clientorderstatusdao.findAll();

        clientorderstatuses = clientorderstatuses.stream().map(
                clientorderstatus -> { Clientorderstatus c = new Clientorderstatus();
                    c.setId(clientorderstatus.getId());
                    c.setName(clientorderstatus.getName());
                    return c; }
        ).collect(Collectors.toList());

        return clientorderstatuses;

    }

}


