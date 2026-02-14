package lk.newdayproducts.entity;



import lk.newdayproducts.util.RegexPattern;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;

@Entity
public class Supplierpayment {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "number")
    private String number;
    @Basic
    @Column(name = "amount")

    private BigDecimal amount;
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "receipt")
    private byte[] receipt;
    @OneToOne
    @JoinColumn(name = "purchaseorder_id", referencedColumnName = "id", nullable = false)
    private Purchaseorder purchaseorder;
    @ManyToOne
    @JoinColumn(name = "supplierpaystatus_id", referencedColumnName = "id", nullable = false)
    private Supplierpaystatus supplierpaystatus;
    @ManyToOne
    @JoinColumn(name = "paytype_id", referencedColumnName = "id", nullable = false)
    private Paytype paytype;
    @Basic
    @Column(name = "paymentref")
    private String paymentref;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;


    public byte[] getReceipt() {
        return receipt;
    }

    public void setReceipt(byte[] receipt) {
        this.receipt = receipt;
    }

    public String getNumber() {
        return number;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }


    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Supplierpayment that = (Supplierpayment) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (amount != null ? !amount.equals(that.amount) : that.amount != null) return false;
        if (date != null ? !date.equals(that.date) : that.date != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (amount != null ? amount.hashCode() : 0);
        result = 31 * result + (date != null ? date.hashCode() : 0);
        return result;
    }

    public String getPaymentref() {
        return paymentref;
    }

    public void setPaymentref(String paymentref) {
        this.paymentref = paymentref;
    }

    public Purchaseorder getPurchaseorder() {
        return purchaseorder;
    }

    public void setPurchaseorder(Purchaseorder purchaseorder) {
        this.purchaseorder = purchaseorder;
    }

    public Supplierpaystatus getSupplierpaystatus() {
        return supplierpaystatus;
    }

    public void setSupplierpaystatus(Supplierpaystatus supplierpaystatus) {
        this.supplierpaystatus = supplierpaystatus;
    }

    public Paytype getPaytype() {
        return paytype;
    }

    public void setPaytype(Paytype paytype) {
        this.paytype = paytype;
    }
}
