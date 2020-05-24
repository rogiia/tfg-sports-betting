mod geteventoddsctrl;

const K_FACTOR: i8 = 32;

pub fn update_team_score(local_elo: i32, visitor_elo: i32, result: char) {
  let expected = geteventoddsctrl::calculate_probabilities_of_winning(0, 0, local_elo, visitor_elo);
  let mut local_points = 0.5;
  let mut visitor_points = 0.5;
  if result == "L" {
    local_points = 1;
    visitor_points = 0;
  } else if result == "V" {
    local_points = 0;
    visitor_points = 1;
  }
  let new_local_elo = local_elo + K_FACTOR * (local_points - expected.local_stake);
  let new_visitor_elo = visitor_elo + K_FACTOR * (visitor_points - expected.visitor_stake);
}