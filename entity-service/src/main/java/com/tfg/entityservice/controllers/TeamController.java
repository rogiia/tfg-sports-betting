package com.tfg.entityservice.controllers;

import com.tfg.entityservice.models.Sport;
import com.tfg.entityservice.models.Team;
import com.tfg.entityservice.repositories.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.ArrayList;
import java.util.List;

@RestController
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @RequestMapping("/sport/{sportId}/team")
    public List<Team> getTeamsBySport(@PathVariable("sportId") long sportId) {
        List<Team> result = new ArrayList<>();
        Iterable<Team> teamsIt = this.teamRepository.findAll();
        for (Team item : teamsIt)
            result.add(item);

        return result;
    }
}