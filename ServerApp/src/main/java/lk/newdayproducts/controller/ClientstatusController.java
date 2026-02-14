package lk.newdayproducts.controller;

import lk.newdayproducts.dao.ClientstatusDao;
import lk.newdayproducts.dao.EmptypeDao;
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
@RequestMapping(value = "/clientstatuses")
public class ClientstatusController {

    @Autowired
    private ClientstatusDao clientstatusdao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Clientstatus> get() {

        List<Clientstatus> clientstatuses = this.clientstatusdao.findAll();

        clientstatuses = clientstatuses.stream().map(
                clientstatus -> { Clientstatus c = new Clientstatus();
                    c.setId(clientstatus.getId());
                    c.setName(clientstatus.getName());
                    return c; }
        ).collect(Collectors.toList());

        return clientstatuses;

    }

}


