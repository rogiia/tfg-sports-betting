package com.tfg.entityservice.repositories;

import com.tfg.entityservice.models.Sport;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface SportRepository extends CrudRepository<Sport, Long> {
    Sport findSportByName(String name);
}