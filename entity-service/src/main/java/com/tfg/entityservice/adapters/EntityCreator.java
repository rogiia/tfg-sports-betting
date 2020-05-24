package com.tfg.entityservice.adapters;

import com.tfg.entityservice.models.Sport;
import com.tfg.entityservice.models.Team;
import com.tfg.entityservice.repositories.SportRepository;
import com.tfg.entityservice.repositories.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.regex.*;

public class EntityCreator {

    @Autowired
    private SportRepository sportRepository;

    @Autowired
    private TeamRepository teamRepository;

    private Team createTeam(String name, Sport sport) {
        Team newTeam = new Team(name, sport);
        return this.teamRepository.save(newTeam);
    }

    public void createEntitiesFromEvent(String event) {
        try {
            Pattern pattern = Pattern.compile("^(.*): (.*) [0-9]-[0-9] (.*)$");
            Matcher matcher = pattern.matcher(event);
            if (matcher.find()) {
                Sport eventSport = this.sportRepository.findSportByName(matcher.group(0));
                List<Team> eventTeam1 = this.teamRepository.getTeamsByNameAndSport(matcher.group(1), eventSport);
                List<Team> eventTeam2 = this.teamRepository.getTeamsByNameAndSport(matcher.group(2), eventSport);
                if (eventTeam1.size() == 0) {
                    this.createTeam(matcher.group(1), eventSport);
                }
                if (eventTeam2.size() == 0) {
                    this.createTeam(matcher.group(2), eventSport);
                }
            } else {
                throw new Error();
            }
        } catch(Error error) {
            System.err.print(String.join("Error parsing event ", event));
        }
    }
}
