extern crate serde_json;
use std::fmt;
use serde::ser::{Serialize, Serializer, SerializeStruct};
use serde::de::{self, Deserialize, Deserializer, Visitor, SeqAccess, MapAccess};
use hyper::{Body, Request, Response, StatusCode, header};
use futures::{Future};
use crate::futures::Stream;

type GenericError = Box<dyn std::error::Error + Send + Sync>;
type ResponseFuture = Box<dyn Future<Item=Response<Body>, Error=GenericError> + Send>;

struct EventOddsRequestBody {
  sport: String,
  local_team_name: String,
  visitor_team_name: String,
  local_team_result: u16,
  visitor_team_result: u16
}

struct EventOddsResult {
  local_stake: f32,
  draw_stake: f32,
  visitor_stake: f32
}

impl<'de> Deserialize<'de> for EventOddsRequestBody {
  fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
  where
    D: Deserializer<'de>,
    {
      enum Field {
        Sport, LocalTeamName, VisitorTeamName, LocalTeamResult, VisitorTeamResult
      }

      impl<'de> Deserialize<'de> for Field {
        fn deserialize<D>(deserializer: D) -> Result<Field, D::Error>
        where
          D: Deserializer<'de>
        {
          struct FieldVisitor;

          impl<'de> Visitor<'de> for FieldVisitor {
            type Value = Field;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
              formatter.write_str("`sport`|`localTeamName`|`visitorTeamName`|`localTeamResult`|`visitorTeamResult`")
            }

            fn visit_str<E>(self, value: &str) -> Result<Field, E>
            where
              E: de::Error,
            {
              match value {
                "sport" => Ok(Field::Sport),
                "localTeamName" => Ok(Field::LocalTeamName),
                "visitorTeamName" => Ok(Field::VisitorTeamName),
                "localTeamResult" => Ok(Field::LocalTeamResult),
                "visitorTeamResult" => Ok(Field::VisitorTeamResult),
                _ => Err(de::Error::unknown_field(value, FIELDS))
              }
            }
          }
          deserializer.deserialize_identifier(FieldVisitor)
        }
      }

      struct EventOddsRequestBodyVisitor;

      impl<'de> Visitor<'de> for EventOddsRequestBodyVisitor {
        type Value = EventOddsRequestBody;
        
        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
          formatter.write_str("struct EventOddsRequestBody")
        }

        fn visit_seq<V>(self, mut seq: V) -> Result<EventOddsRequestBody, V::Error>
        where
          V: SeqAccess<'de>
        {
          let sport = seq.next_element()?
            .ok_or_else(|| de::Error::invalid_length(0, &self))?;
          let local_team_name = seq.next_element()?
            .ok_or_else(|| de::Error::invalid_length(1, &self))?;
          let visitor_team_name = seq.next_element()?
            .ok_or_else(|| de::Error::invalid_length(2, &self))?;
          let local_team_result = seq.next_element()?
            .ok_or_else(|| de::Error::invalid_length(3, &self))?;
          let visitor_team_result = seq.next_element()?
            .ok_or_else(|| de::Error::invalid_length(4, &self))?;
          Ok(EventOddsRequestBody {
            sport: sport,
            local_team_name: local_team_name,
            visitor_team_name: visitor_team_name,
            local_team_result: local_team_result,
            visitor_team_result: visitor_team_result
          })
        }

        fn visit_map<V>(self, mut map: V) -> Result<EventOddsRequestBody, V::Error>
        where
          V: MapAccess<'de>,
        {
          let mut sport = None;
          let mut local_team_name = None;
          let mut visitor_team_name = None;
          let mut local_team_result = None;
          let mut visitor_team_result = None;
          while let Some(key) = map.next_key()? {
            match key {
              Field::Sport => {
                if sport.is_some() {
                  return Err(de::Error::duplicate_field("sport"));
                }
                sport = Some(map.next_value()?);
              }
              Field::LocalTeamName => {
                if local_team_name.is_some() {
                  return Err(de::Error::duplicate_field("local_team_name"));
                }
                local_team_name = Some(map.next_value()?);
              }
              Field::VisitorTeamName => {
                if visitor_team_name.is_some() {
                  return Err(de::Error::duplicate_field("visitor_team_name"));
                }
                visitor_team_name = Some(map.next_value()?);
              }
              Field::LocalTeamResult => {
                if local_team_result.is_some() {
                  return Err(de::Error::duplicate_field("local_team_result"));
                }
                local_team_result = Some(map.next_value()?);
              }
              Field::VisitorTeamResult => {
                if visitor_team_result.is_some() {
                  return Err(de::Error::duplicate_field("visitor_team_result"));
                }
                visitor_team_result = Some(map.next_value()?);
              }
            }
          }
          let sport = sport.ok_or_else(|| de::Error::missing_field("sport"))?;
          let local_team_name = local_team_name.ok_or_else(|| de::Error::missing_field("local_team_name"))?;
          let visitor_team_name = visitor_team_name.ok_or_else(|| de::Error::missing_field("visitor_team_name"))?;
          let local_team_result = local_team_result.ok_or_else(|| de::Error::missing_field("local_team_result"))?;
          let visitor_team_result = visitor_team_result.ok_or_else(|| de::Error::missing_field("visitor_team_result"))?;
          Ok(EventOddsRequestBody {
            sport: sport,
            local_team_name: local_team_name,
            visitor_team_name: visitor_team_name,
            local_team_result: local_team_result,
            visitor_team_result: visitor_team_result
          })
        }
      }
      const FIELDS: &'static [&'static str] = &["sport", "localTeamName", "visitorTeamName", "localTeamResult", "visitorTeamResult"];
      deserializer.deserialize_struct("EventOddsRequestBody", FIELDS, EventOddsRequestBodyVisitor)
    }
}

impl Serialize for EventOddsResult {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
    {
      let mut state = serializer.serialize_struct("EventOddsResult", 3)?;
      state.serialize_field("local_stake", &self.local_stake)?;
      state.serialize_field("draw_stake", &self.draw_stake)?;
      state.serialize_field("visitor_stake", &self.visitor_stake)?;
      state.end()
    }
}

pub fn get_event_odds(req: Request<Body>) -> ResponseFuture {
  Box::new(req.into_body()
    .concat2()
    .from_err()
    .and_then(|entire_body| {
      let str = String::from_utf8(entire_body.to_vec())?;
      let body_data: EventOddsRequestBody = serde_json::from_str(&str).unwrap();
      let difference = body_data.local_team_result - body_data.visitor_team_result;
      let local_stake = difference as f32;
      let visitor_stake = difference as f32 * -1.0;
      let draw_stake = difference as f32 - difference as f32;
      let response = EventOddsResult {
        local_stake: local_stake,
        draw_stake: draw_stake,
        visitor_stake: visitor_stake
      };
      let json = serde_json::to_string(&response)?;
      let response = Response::builder()
        .status(StatusCode::OK)
        .header(header::CONTENT_TYPE, "application/json")
        .body(Body::from(json))?;
      Ok(response)
    })
  )
}