package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lk.newdayproducts.util.RegexPattern;


import javax.persistence.*;
import java.sql.Date;
import java.util.Collection;

@Entity
public class Supplier {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")

    private String name;

    @Basic
    @Column(name = "doregister")
    private Date doregister;

    @Basic
    @Column(name = "address")

    private String address;
    @Basic
    @Column(name = "telephone")

    private String telephone;
    @Basic
    @Column(name = "email")

    private String email;
    @Basic
    @Column(name = "description")

    private String description;
    @ManyToOne
    @JoinColumn(name = "supplierstatus_id", referencedColumnName = "id", nullable = false)
    private Supplierstatus supplierstatus;
    @ManyToOne
    @JoinColumn(name = "state_id", referencedColumnName = "id", nullable = false)
    private State state;


    @OneToMany(mappedBy = "supplier", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Suppliermaterialcategory> suppliermaterialcategories;
    @JsonIgnore
    @OneToMany(mappedBy = "supplier")
    private Collection<Purchaseorder> purchaseorders;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public Date getDoregister() {
        return doregister;
    }

    public void setDoregister(Date doregister) {
        this.doregister = doregister;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

        Supplier supplier = (Supplier) o;

        if (id != null ? !id.equals(supplier.id) : supplier.id != null) return false;
        if (name != null ? !name.equals(supplier.name) : supplier.name != null) return false;
        if (doregister != null ? !doregister.equals(supplier.doregister) : supplier.doregister != null) return false;
        if (address != null ? !address.equals(supplier.address) : supplier.address != null) return false;
        if (telephone != null ? !telephone.equals(supplier.telephone) : supplier.telephone != null) return false;
        if (email != null ? !email.equals(supplier.email) : supplier.email != null) return false;
        if (description != null ? !description.equals(supplier.description) : supplier.description != null)
            return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        result = 31 * result + (doregister != null ? doregister.hashCode() : 0);
        result = 31 * result + (address != null ? address.hashCode() : 0);
        result = 31 * result + (telephone != null ? telephone.hashCode() : 0);
        result = 31 * result + (email != null ? email.hashCode() : 0);
        result = 31 * result + (description != null ? description.hashCode() : 0);
        return result;
    }

    public Supplierstatus getSupplierstatus() {
        return supplierstatus;
    }

    public void setSupplierstatus(Supplierstatus supplierstatus) {
        this.supplierstatus = supplierstatus;
    }

    public State getState() {
        return state;
    }

    public void setState(State state) {
        this.state = state;
    }

    public Collection<Suppliermaterialcategory> getSuppliermaterialcategories() {
        return suppliermaterialcategories;
    }

    public void setSuppliermaterialcategories(Collection<Suppliermaterialcategory> suppliermaterialcategories) {
        this.suppliermaterialcategories = suppliermaterialcategories;
    }

    public Collection<Purchaseorder> getPurchaseorders() {
        return purchaseorders;
    }

    public void setPurchaseorders(Collection<Purchaseorder> purchaseorders) {
        this.purchaseorders = purchaseorders;
    }
}
