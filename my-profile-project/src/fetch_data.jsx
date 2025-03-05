import axios from "axios";

const API = "https://learn.reboot01.com/api/graphql-engine/v1/graphql";

export async function fetchUserData() {
  try {
    // Normal query and Nested query for timeline
    const userQuery = `query {
                            user {
                                id
                                login
                                attrs
                                email
                                campus
                                profile
                                lastName
                                firstName
                                auditRatio
                                totalUp
                                totalDown
                                timeline: transactions(
                                      where: {type: {_eq: "xp"}, _or: [{attrs: {_eq: {}}}, {attrs: {_has_key: "group"}}], _and: [{path: {_nlike: "%/piscine-js/%"}}, {path: {_nlike: "%/piscine-go/%"}}]}
                                    ) {
                                       amount
                                       createdAt
                                       path
                                      }
                            }
  
                        }`;

    // Create payload
    const payload = {
      query: userQuery,
    };

    const header = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    // Make request
    return axios
      .post(API, payload, header)
      .then((response) => response.data.data.user[0])
      .catch((error) => {
        console.log(error);
      });
    // Handle error
  } catch (error) {
    console.log(error);
    //handleError(error);
  }
}

export async function fetchSkills() {
  try {
    //Nested query
    const query = `
      query Transaction2 {
      transaction(
        where: {
          type: {
            _iregex: "(^|[^[:alnum:]_])[[:alnum:]_]*skill_[[:alnum:]_]*($|[^[:alnum:]_])"
          }
        }
      ) {
        amount
        type
      }
    }
    `;

    const payload = {
      query: query,
    };

    const header = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    // Make request
    const response = await axios.post(API, payload, header);
    return response.data.data.transaction;
    // Handle error
  } catch (error) {
    console.log(error);
    //handleError(error);
  }
}

export async function fetchLevel(username) {
  try {
    //arguments query
    const query = `
  query Event_user($userlogin: String) {
    event_user(
      where: {
        userLogin: { _eq: $userlogin }
        event: { path: { _eq: "/bahrain/bh-module" } }
      }
    ) {
      level
    }
  }
  `;

    const payload = {
      query: query,
      variables: { userlogin: username },
    };

    const header = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    // Make request
    const response = await axios.post(API, payload, header);
    return response.data.data.event_user[0].level;
    // Handle error
  } catch (error) {
    console.log(error);
    //handleError(error);
  }
}

export async function fetchXP() {
  try {
    const payload = {
      query: `query {
        transaction_aggregate(
          where: {
            event: { path: { _eq: "/bahrain/bh-module" } }
            type: { _eq: "xp" }
          }
        ) {
          aggregate {
            sum {
              amount
            }
          }
        }
      }`,
    };

    const response = await axios.post(API, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    // Return the sum of XP amount
    return response.data.data.transaction_aggregate.aggregate.sum.amount;
  } catch (error) {
    console.log(error);
    return 0; // Return 0 if there's an error
  }
}
