package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;


import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Collection;

@Entity
public class Clientorder {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "number")
    private String number;
    @Basic
    @Column(name = "doexpected")
    private Date doexpected;
    @Basic
    @Column(name = "expectedtotal")
    private BigDecimal expectedtotal;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "advancedpay")
    private BigDecimal advancedpay;
    @Basic
    @Column(name = "receipt")
    private byte[] receipt;
    @Basic
    @Column(name = "doplaced")
    private Timestamp doplaced;
    @Basic
    @Column(name = "completepercentage")
    private String completepercentage;
    @ManyToOne
    @JoinColumn(name = "client_id", referencedColumnName = "id", nullable = false)
    private Client client;
    @ManyToOne
    @JoinColumn(name = "clientorderstatus_id", referencedColumnName = "id", nullable = false)
    private Clientorderstatus clientorderstatus;
    @ManyToOne
    @JoinColumn(name = "paidstatus_id", referencedColumnName = "id", nullable = false)
    private Paidstatus paidstatus;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @OneToMany(mappedBy = "clientorder", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Orderproduct> orderproducts;

    @JsonIgnore
    @OneToMany(mappedBy = "clientorder")
    private Collection<Productionorder> productionorders;

    public Clientorder(Integer id) {
        this.id = id;
    }

    public Clientorder() {
    }

    public BigDecimal getAdvancedpay() {
        return advancedpay;
    }

    public void setAdvancedpay(BigDecimal advancedpay) {
        this.advancedpay = advancedpay;
    }

    public byte[] getReceipt() {
        return receipt;
    }

    public Paidstatus getPaidstatus() {
        return paidstatus;
    }

    public void setPaidstatus(Paidstatus paidstatus) {
        this.paidstatus = paidstatus;
    }

    public void setReceipt(byte[] receipt) {
        this.receipt = receipt;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getDoexpected() {
        return doexpected;
    }

    public void setDoexpected(Date doexpected) {
        this.doexpected = doexpected;
    }

    public String getCompletepercentage() {
        return completepercentage;
    }

    public void setCompletepercentage(String completepercentage) {
        this.completepercentage = completepercentage;
    }

    public Collection<Productionorder> getProductionorders() {
        return productionorders;
    }

    public void setProductionorders(Collection<Productionorder> productionorders) {
        this.productionorders = productionorders;
    }

    @Override
    public String toString() {
        return "Clientorder{" +
               "id=" + id +
               ", number='" + number + '\'' +
               ", doexpected=" + doexpected +
               ", expectedtotal=" + expectedtotal +
               ", description='" + description + '\'' +
               ", advancedpay=" + advancedpay +
               ", receipt=" + Arrays.toString(receipt) +
               ", doplaced=" + doplaced +
               ", completepercentage='" + completepercentage + '\'' +
               ", client=" + client +
               ", clientorderstatus=" + clientorderstatus +
               ", paidstatus=" + paidstatus +
               ", employee=" + employee +
               ", orderproducts=" + orderproducts +
               ", productionorders=" + productionorders +
               '}';
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getDoplaced() {
        return doplaced;
    }

    public void setDoplaced(Timestamp doplaced) {
        this.doplaced = doplaced;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Clientorder that = (Clientorder) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (doexpected != null ? !doexpected.equals(that.doexpected) : that.doexpected != null) return false;

        if (description != null ? !description.equals(that.description) : that.description != null) return false;
        if (doplaced != null ? !doplaced.equals(that.doplaced) : that.doplaced != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (doexpected != null ? doexpected.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        result = 31 * result + (doplaced != null ? doplaced.hashCode() : 0);
        return result;
    }

    public BigDecimal getExpectedtotal() {
        return expectedtotal;
    }

    public void setExpectedtotal(BigDecimal expectedtotal) {
        this.expectedtotal = expectedtotal;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    public Clientorderstatus getClientorderstatus() {
        return clientorderstatus;
    }

    public void setClientorderstatus(Clientorderstatus clientorderstatus) {
        this.clientorderstatus = clientorderstatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Collection<Orderproduct> getOrderproducts() {
        return orderproducts;
    }

    public void setOrderproducts(Collection<Orderproduct> orderproducts) {
        this.orderproducts = orderproducts;
    }

}
