package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class ExpenseOfPurchaseorderByDate {

    private Integer id;
    private String purchaseOrderNumber;
    private String supplierName;
    private BigDecimal expense;

    public ExpenseOfPurchaseorderByDate(String purchaseOrderNumber, String supplierName, BigDecimal expense) {
        this.purchaseOrderNumber = purchaseOrderNumber;
        this.supplierName = supplierName;
        this.expense = expense;
    }

    public ExpenseOfPurchaseorderByDate(String supplierName,String purchaseOrderNumber) {
        this.purchaseOrderNumber = purchaseOrderNumber;
        this.supplierName = supplierName;
    }

    public String getSupplierName() {return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }

    public ExpenseOfPurchaseorderByDate() {  }

    public String getPurchaseOrderNumber() {
        return purchaseOrderNumber;
    }

    public void setPurchaseOrderNumber(String purchaseOrderNumber) {
        this.purchaseOrderNumber = purchaseOrderNumber;
    }






    public void setId(Integer id) {
        this.id = id;
    }

    @Id
    public Integer getId() {
        return id;
    }


}
