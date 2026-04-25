package lk.newdayproducts.report;

import lk.newdayproducts.entity.Charge;
import lk.newdayproducts.report.dao.CountByMaterialCategoryDao;
import lk.newdayproducts.report.entity.CountByMaterialCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/reports")
public class ReportController {

    @GetMapping(path ="/countbymaterialcategory", produces = "application/json")
    public List<CountByMaterialCategory> get() {
        List<CountByMaterialCategory> cats =countbymaterialcategorydao.countCountByMaterialCategory();
        System.out.println("in  --------"+cats);
        long totalCount = 0;

        for(CountByMaterialCategory countByMaterialCategory: cats){
            totalCount += countByMaterialCategory.getCount();
        }

        for(CountByMaterialCategory countbymc: cats){
            long count = countbymc.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage*100.00)/100;
            countbymc.setPercentage(percentage);
        }
        System.out.println(cats);
        return cats;

    }

    @Autowired
    private CountByMaterialCategoryDao countbymaterialcategorydao;

//    @GetMapping(path ="/countbymaterialcategory ", produces = "application/json")
//    public List<CountByMaterialCategory> getCountByMaterialCategory() {
//
//        System.out.println("in  --------");
//        List<CountByMaterialCategory> cats =countbymaterialcategorydao.countCountByMaterialCategory();
//        long totalCount = 0;
//
//        for(CountByMaterialCategory countByMaterialCategory: cats){
//            totalCount += countByMaterialCategory.getCount();
//        }
//
//        for(CountByMaterialCategory countbymc: cats){
//            long count = countbymc.getCount();
//            double percentage = (double) count / totalCount * 100;
//            percentage = Math.round(percentage*100.00)/100;
//            countbymc.setPercentage(percentage);
//        }
//        System.out.println(cats);
//        return cats;
//    }

}



