package com.tfg.entityservice.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.JoinColumn;
import javax.persistence.FetchType;

@Table(name = "team")
@Entity
public class Team extends BaseEntity {

    @Column( name = "name" )
    private final String name;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "sport_id", nullable = false)
    private final Sport sport;

    public Team() { this.name = null; this.sport = null; }

    public Team(String name, Sport sport) {
        this.name = name;
        this.sport = sport;
    }

    public String getName() {
        return name;
    }

    public Sport getSport() { return sport; }
}
