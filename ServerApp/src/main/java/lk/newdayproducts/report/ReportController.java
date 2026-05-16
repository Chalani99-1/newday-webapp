package lk.newdayproducts.report;

import lk.newdayproducts.dao.ProductionorderDao;
import lk.newdayproducts.dao.PurchaseorderDao;
import lk.newdayproducts.entity.Charge;
import lk.newdayproducts.entity.Purchaseorder;
import lk.newdayproducts.report.dao.*;
import lk.newdayproducts.report.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.stream.Collectors;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.util.*;

@CrossOrigin
@RestController
@RequestMapping(value = "/reports")
public class ReportController {
    @Autowired
    private CountByMaterialCategoryDao countbymaterialcategorydao;
    @Autowired
    private ClientCountByStateDao clientcountbystatedao;
    @Autowired
    private SupplierCountByMaterialCategoryDao suppliercountbymaterialcategorydao;
    @Autowired
    private ProductionOrderCountByDateDao productionordercountbydatedao;
    @Autowired
    private ProductionorderDao productionorderdao;
    @Autowired
    private PurchaseOrderCountByDateDao purchaseordercountbydatedao;
    @Autowired
    private ClientOrderCountByDateDao clientordercountbydatedao;
    @Autowired
    private ProductCountByCategoryDao productcountbycategorydao;
    @Autowired
    private ExpenseOfPurchaseOrderByDateDao expenseofpurchaseorderbydatedao;
    @Autowired
    private PurchaseorderDao purchaseorderdao;

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

    @GetMapping(path ="/clientcountbystate", produces = "application/json")
    public List<ClientCountByState> getclientcountbystate() {
        List<ClientCountByState> sts =clientcountbystatedao.countClientCountByState();
        System.out.println("in  --------"+sts);
        long totalCount = 0;

        for(ClientCountByState clientCountByState: sts){
            totalCount += clientCountByState.getCount();
        }

        for(ClientCountByState countbyst: sts){
            long count = countbyst.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage*100.00)/100;
            countbyst.setPercentage(percentage);
        }
        System.out.println(sts);
        return sts;

    }

    @GetMapping(path ="/suppliercountbymaterialcategory", produces = "application/json")
    public List<SupplierCountByMaterialCategory> getsuppliercountbymaterialcategory() {
        List<SupplierCountByMaterialCategory> supcbmat =suppliercountbymaterialcategorydao.countSupplierCountByMaterialCategory();
        System.out.println("in  --------"+supcbmat);
        long totalCount = 0;

        for(SupplierCountByMaterialCategory supplierCountByMaterialCategory: supcbmat){
            totalCount += supplierCountByMaterialCategory.getCount();
        }

        for(SupplierCountByMaterialCategory countbymt: supcbmat){
            long count = countbymt.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage*100.00)/100;
            countbymt.setPercentage(percentage);
        }
        System.out.println(supcbmat);
        return supcbmat;

    }

    @GetMapping(path = "/productionordercountbydate", produces = "application/json")
    public List<ProductionOrderCountByDate> getProductionOrderCountByDate(@RequestParam String startDate, @RequestParam String endDate) {

        Date start;
        Date end;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            start = dateFormat.parse(startDate);
            end = dateFormat.parse(endDate);
        } catch (ParseException e) {

            e.printStackTrace();
            return null;
        }

        List<ProductionOrderCountByDate> counts = productionordercountbydatedao.productionOrderCountByDate(start, end);
        long totalCount = 0;

        for (ProductionOrderCountByDate poc : counts) {
            totalCount += poc.getCount();
        }

        for (ProductionOrderCountByDate countbyod : counts) {
            long count = countbyod.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countbyod.setPercentage(percentage);
        }

        return counts;
    }

    @GetMapping(path = "/productionordercountbydateall", produces = "application/json")
    public List<ProductionOrderCountByDate> getProductionOrderCountByDate() {

        List<ProductionOrderCountByDate> counts = productionordercountbydatedao.productionOrderCountByDateAll();
        long totalCount = 0;

        for (ProductionOrderCountByDate poc : counts) {
            totalCount += poc.getCount();
        }

        for (ProductionOrderCountByDate countbyod : counts) {
            long count = countbyod.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countbyod.setPercentage(percentage);
        }

        return counts;
    }

    @GetMapping(path = "/purchaseordercountbydate", produces = "application/json")
    public List<PurchaseOrderCountByDate> getPurchaseOrderCountByDate(@RequestParam String startDate, @RequestParam String endDate) {

        Date start;
        Date end;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            start = dateFormat.parse(startDate);
            end = dateFormat.parse(endDate);
        } catch (ParseException e) {

            e.printStackTrace();
            return null;
        }

        List<PurchaseOrderCountByDate> counts = purchaseordercountbydatedao.purchaseOrderCountByDate(start, end);
        long totalCount = 0;

        for (PurchaseOrderCountByDate poc : counts) {
            totalCount += poc.getCount();
        }

        for (PurchaseOrderCountByDate countbyod : counts) {
            long count = countbyod.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countbyod.setPercentage(percentage);
        }

        return counts;
    }

    @GetMapping(path = "/purchaseordercountbydateall", produces = "application/json")
    public List<PurchaseOrderCountByDate> getPurchaseOrderCountByDate() {

        List<PurchaseOrderCountByDate> counts = purchaseordercountbydatedao.purchaseOrderCountByDateAll();
        long totalCount = 0;

        for (PurchaseOrderCountByDate poc : counts) {
            totalCount += poc.getCount();
        }

        for (PurchaseOrderCountByDate countbyod : counts) {
            long count = countbyod.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countbyod.setPercentage(percentage);
        }

        return counts;
    }

    @GetMapping(path = "/clientordercountbyplaceddate", produces = "application/json")
    public List<ClientOrderCountByDate> getClientOrderCountByDate(@RequestParam String startDate, @RequestParam String endDate) {

        Date start;
        Date end;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            start = dateFormat.parse(startDate);
            end = dateFormat.parse(endDate);
        } catch (ParseException e) {

            e.printStackTrace();
            return null;
        }

        List<ClientOrderCountByDate> counts = clientordercountbydatedao.clientOrderCountByDate(start, end);
        long totalCount = 0;

        for (ClientOrderCountByDate poc : counts) {
            totalCount += poc.getCount();
        }

        for (ClientOrderCountByDate countbyod : counts) {
            long count = countbyod.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countbyod.setPercentage(percentage);
        }

        return counts;
    }

    @GetMapping(path = "/clientordercountbydateall", produces = "application/json")
    public List<ClientOrderCountByDate> getClientOrderCountByDate() {

        List<ClientOrderCountByDate> counts = clientordercountbydatedao.clientOrderCountByDateAll();
        long totalCount = 0;

        for (ClientOrderCountByDate poc : counts) {
            totalCount += poc.getCount();
        }

        for (ClientOrderCountByDate countbyod : counts) {
            long count = countbyod.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage * 100.0) / 100.0;
            countbyod.setPercentage(percentage);
        }

        return counts;
    }

    @GetMapping(path ="/productcountbycategory", produces = "application/json")
    public List<ProductCountByCategory> getproductcountbycategory() {
        List<ProductCountByCategory> sts =productcountbycategorydao.countProductCountByCategory();
        System.out.println("in  --------"+sts);
        long totalCount = 0;

        for(ProductCountByCategory clientCountByState: sts){
            totalCount += clientCountByState.getCount();
        }

        for(ProductCountByCategory countbyst: sts){
            long count = countbyst.getCount();
            double percentage = (double) count / totalCount * 100;
            percentage = Math.round(percentage*100.00)/100;
            countbyst.setPercentage(percentage);
        }
        System.out.println(sts);
        return sts;

    }


//    @GetMapping(path = "/expenseofpurchaseorderbydate", produces = "application/json")
//    public List<ExpenseOfPurchaseorderByDate> getExpenseOfPurchaseorderByDate(@RequestParam String startDate, @RequestParam String endDate) {
//
//        Date start;
//        Date end;
//        try {
//            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
//            start = dateFormat.parse(startDate);
//            end = dateFormat.parse(endDate);
//        } catch (ParseException e) {
//
//            e.printStackTrace();
//            return null;
//        }
//
//        List<ExpenseOfPurchaseorderByDate> pbobdates = new ArrayList<>();
//        List<Purchaseorder> corders = expenseofpurchaseorderbydatedao.expenseOfPurchaseorderByDate(start, end);
//        for (Purchaseorder corder : corders) {
//            BigDecimal expense = BigDecimal.valueOf(0.0);
//            ExpenseOfPurchaseorderByDate ob1 = new ExpenseOfPurchaseorderByDate (corder.getNumber(), corder.getSupplier().getName(), corder.getExpectedtotal());
//            pbobdates.add(ob1);
//        }
//
//        return pbobdates;
//    }

    @GetMapping(path = "/expenseofpurchaseorderbydate", produces = "application/json")
    public List<ExpenseOfPurchaseorderByDate> getPurchaseOrderExpenseByDate(@RequestParam String startDate,@RequestParam String endDate ) {

        Date start;
        Date end;
        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            start = dateFormat.parse(startDate);
            end = dateFormat.parse(endDate);
        } catch (ParseException e) {
            e.printStackTrace();
            return null;
        }


        List<ExpenseOfPurchaseorderByDate> pbobdates = new ArrayList<>();
        List<Purchaseorder> porders = expenseofpurchaseorderbydatedao.getPurchaseOrderExpectedByDate(start, end);
        for (Purchaseorder porder : porders) {
            BigDecimal expense = BigDecimal.valueOf(0.0);
            ExpenseOfPurchaseorderByDate ob1 =
                    new ExpenseOfPurchaseorderByDate
                            (porder.getNumber(),
                                    porder.getSupplier().getName(),
                                    porder.getExpectedtotal());
            pbobdates.add(ob1);
        }

        return pbobdates;
    }


    @GetMapping(path = "/expenseofpurchaseorderall", produces = "application/json")
    public List<ExpenseOfPurchaseorderByDate> getPurchaseOrderExpenseByDateAll() {

        List<ExpenseOfPurchaseorderByDate> pbobdates = new ArrayList<ExpenseOfPurchaseorderByDate>();
        List<Purchaseorder> porders = purchaseorderdao.findAll();
        for (Purchaseorder corder : porders) {
            BigDecimal expense = BigDecimal.valueOf(0.0);

            ExpenseOfPurchaseorderByDate ob1 =
                    new ExpenseOfPurchaseorderByDate
                            (corder.getNumber(),
                                    corder.getSupplier().getName(),
                                    corder.getExpectedtotal());
            pbobdates.add(ob1);
        }

        return pbobdates;
    }
}



