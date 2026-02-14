package lk.newdayproducts.controller;

import lk.newdayproducts.dao.McsizeDao;
import lk.newdayproducts.entity.Mcsize;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/mcsizes")
public class McsizeController {

    @Autowired
    private McsizeDao mcsizedao;

    @GetMapping(path ="/list", produces = "application/json")
    public List<Mcsize> get() {

        List<Mcsize> mcsizes = this.mcsizedao.findAll();

        mcsizes = mcsizes.stream().map(
                mcsize -> { Mcsize m = new Mcsize();
                    m.setId(mcsize.getId());
                    m.setName(mcsize.getName());
                    m.setMaterialtype(mcsize.getMaterialtype());
                    return m; }
        ).collect(Collectors.toList());

        return mcsizes;

    }

}


