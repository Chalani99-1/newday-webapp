package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class PurchaseOrderExpenseByDate {

    private Integer id;
    private String purchaseOrderNumber;
    private String supplierName;
    private BigDecimal expense;

    public PurchaseOrderExpenseByDate(String purchaseOrderNumber, String supplierName, BigDecimal expense) {
        this.purchaseOrderNumber = purchaseOrderNumber;
        this.supplierName = supplierName;
        this.expense = expense;
    }

    public String getSupplierName() {
        return supplierName;
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

    public PurchaseOrderExpenseByDate() {
    }

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
