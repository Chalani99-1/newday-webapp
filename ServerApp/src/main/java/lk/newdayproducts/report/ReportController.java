package lk.newdayproducts.report;
import lk.newdayproducts.dao.MaterialcategoryDao;
import lk.newdayproducts.entity.Materialcategory;
import lk.newdayproducts.report.dao.CountByMaterialCategoryDao;
import lk.newdayproducts.report.entity.CountByMaterialCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/reports")
public class ReportController {

    @Autowired
    private CountByMaterialCategoryDao countbymaterialcategorydao;
    @GetMapping(path ="/CountByMaterialCategory ", produces = "application/json")
    public List<CountByMaterialCategory> getCountByMaterialCategory() {

        List<CountByMaterialCategory> cats = this.countbymaterialcategorydao.rawMaterialCountByMaterialCategory();
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

}



