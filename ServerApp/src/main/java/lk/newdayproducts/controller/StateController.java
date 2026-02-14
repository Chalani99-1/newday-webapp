package lk.newdayproducts.controller;

import lk.newdayproducts.dao.StateDao;
import lk.newdayproducts.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/states")
public class StateController {

    @Autowired
    private StateDao statedao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<State> get() {

        List<State> states = this.statedao.findAll();

        states = states.stream().map(
                state -> { State s = new State();
                    s.setId(state.getId());
                    s.setName(state.getName());
                    return s; }
        ).collect(Collectors.toList());

        return states;

    }

}


