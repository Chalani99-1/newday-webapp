package lk.newdayproducts.entity;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;

@Entity
public class Invoice {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "number")
    private String number;
    @Basic
    @Column(name = "date")
    private Date date;
    @Basic
    @Column(name = "grandtotal")
    private BigDecimal grandtotal;
    @Basic
    @Column(name = "paymentref")
    private String paymentref;
    @Basic
    @Column(name = "receipt")
    private byte[] receipt;
    @Basic
    @Column(name = "description")
    private String description;
    @ManyToOne
    @JoinColumn(name = "paytype_id", referencedColumnName = "id", nullable = false)
    private Paytype paytype;
    @ManyToOne
    @JoinColumn(name = "invoicestatus_id", referencedColumnName = "id", nullable = false)
    private Invoicestatus invoicestatus;
    @ManyToOne
    @JoinColumn(name = "clientorder_id", referencedColumnName = "id", nullable = false)
    private Clientorder clientorder;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;

    public String getPaymentref() {
        return paymentref;
    }

    public void setPaymentref(String paymentref) {
        this.paymentref = paymentref;
    }

    public byte[] getReceipt() {
        return receipt;
    }

    public void setReceipt(byte[] receipt) {
        this.receipt = receipt;
    }

    public Paytype getPaytype() {
        return paytype;
    }

    public void setPaytype(Paytype paytype) {
        this.paytype = paytype;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public BigDecimal getGrandtotal() {
        return grandtotal;
    }

    public void setGrandtotal(BigDecimal grandtotal) {
        this.grandtotal = grandtotal;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Invoice invoice = (Invoice) o;

        if (id != null ? !id.equals(invoice.id) : invoice.id != null) return false;
        if (number != null ? !number.equals(invoice.number) : invoice.number != null) return false;
        if (date != null ? !date.equals(invoice.date) : invoice.date != null) return false;
        if (grandtotal != null ? !grandtotal.equals(invoice.grandtotal) : invoice.grandtotal != null) return false;
        if (description != null ? !description.equals(invoice.description) : invoice.description != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (number != null ? number.hashCode() : 0);
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + (grandtotal != null ? grandtotal.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        return result;
    }

    public Invoicestatus getInvoicestatus() {
        return invoicestatus;
    }

    public void setInvoicestatus(Invoicestatus invoicestatus) {
        this.invoicestatus = invoicestatus;
    }

    public Clientorder getClientorder() {
        return clientorder;
    }

    public void setClientorder(Clientorder clientorder) {
        this.clientorder = clientorder;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

     }
