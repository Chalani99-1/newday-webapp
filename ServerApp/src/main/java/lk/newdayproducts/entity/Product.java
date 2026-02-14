package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;
import java.sql.Date;
import java.util.Arrays;
import java.util.Collection;

@Entity
public class Product {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "code")
    private String code;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "tcbeforecharge")
    private BigDecimal tcbeforecharge;
    @Basic
    @Column(name = "totalcost")
    private BigDecimal totalcost;
    @Basic
    @Column(name = "designimage")
    private byte[] designimage;

    @Basic
    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Productrawmaterial> productrawmaterials;
    @ManyToOne
    @JoinColumn(name = "productcategory_id", referencedColumnName = "id", nullable = false)
    private Productcategory productcategory;

    @ManyToOne
    @JoinColumn(name = "productsize_id", referencedColumnName = "id", nullable = false)
    private Productsize productsize;
    @ManyToOne
    @JoinColumn(name = "charge_id", referencedColumnName = "id", nullable = false)
    private Charge charge;
    @ManyToOne
    @JoinColumn(name = "productstatus_id", referencedColumnName = "id", nullable = false)
    private Productstatus productstatus;
    @ManyToOne
    @JoinColumn(name = "employee_id", referencedColumnName = "id", nullable = false)
    private Employee employee;
    @JsonIgnore
    @OneToMany(mappedBy = "product")
    private Collection<Productionorderproduct> productionorderproducts;

    @OneToMany(mappedBy = "product")
    @JsonIgnore
    private Collection<Orderproduct> orderproducts;


    public BigDecimal getTcbeforecharge() {
        return tcbeforecharge;
    }

    public void setTcbeforecharge(BigDecimal tcbeforecharge) {
        this.tcbeforecharge = tcbeforecharge;
    }

    public Charge getCharge() {
        return charge;
    }

    public void setCharge(Charge charge) {
        this.charge = charge;
    }


    public Productsize getProductsize() {
        return productsize;
    }

    public void setProductsize(Productsize productsize) {
        this.productsize = productsize;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public BigDecimal getTotalcost() {
        return totalcost;
    }

    public void setTotalcost(BigDecimal totalcost) {
        this.totalcost = totalcost;
    }

    public byte[] getDesignimage() {
        return designimage;
    }

    public void setDesignimage(byte[] designimage) {
        this.designimage = designimage;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Product product = (Product) o;

        if (id != null ? !id.equals(product.id) : product.id != null) return false;
        if (code != null ? !code.equals(product.code) : product.code != null) return false;
        if (totalcost != null ? !totalcost.equals(product.totalcost) : product.totalcost != null) return false;
        if (!Arrays.equals(designimage, product.designimage)) return false;
        if (description != null ? !description.equals(product.description) : product.description != null) return false;
        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (code != null ? code.hashCode() : 0);
        result = 31 * result + (totalcost != null ? totalcost.hashCode() : 0);
        result = 31 * result + Arrays.hashCode(designimage);
        result = 31 * result + (description != null ? description.hashCode() : 0);

        return result;
    }

    public Productcategory getProductcategory() {
        return productcategory;
    }

    public void setProductcategory(Productcategory productcategory) {
        this.productcategory = productcategory;
    }

    public Productstatus getProductstatus() {
        return productstatus;
    }

    public void setProductstatus(Productstatus productstatus) {
        this.productstatus = productstatus;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

    public Collection<Productrawmaterial> getProductrawmaterials() {
        return productrawmaterials;
    }

    public void setProductrawmaterials(Collection<Productrawmaterial> productrawmaterials) {
        this.productrawmaterials = productrawmaterials;
    }

    public Collection<Productionorderproduct> getProductionorderproducts() {
        return productionorderproducts;
    }

    public void setProductionorderproducts(Collection<Productionorderproduct> productionorderproducts) {
        this.productionorderproducts = productionorderproducts;
    }

    public Collection<Orderproduct> getOrderproducts() {
        return orderproducts;
    }

    public void setOrderproducts(Collection<Orderproduct> orderproducts) {
        this.orderproducts = orderproducts;
    }
}
