package com.tfg.entityservice.models;

import javax.persistence.*;

@Table(name = "sport")
@Entity
public class Sport extends BaseEntity {

    @Column( name = "name" )
    private String name;

    public Sport() {
        this.name = null;
    }

    public Sport(String name) { this.name = name; }

    public String getName() {
        return name;
    }
}
