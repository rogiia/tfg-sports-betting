package com.tfg.entityservice.repositories;

import com.tfg.entityservice.models.Sport;
import com.tfg.entityservice.models.Team;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface TeamRepository extends CrudRepository<Team, Long> {
    List<Team> getTeamsBySport(Sport sport);

    List<Team> getTeamsByNameAndSport(String name, Sport sport);
}