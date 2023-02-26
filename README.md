# HackIllinois2023 - Livv

## Inspiration
In large group settings it becomes difficult to organize tasks and manage expenses due each component needing a different ecosystem. Livv intends to simplify roommate management by aggregating common parts of living together.

## What it does
Livv provides a way to submit expenses and create groups of people that live together, app login is done through Splitwise and financial matters can also be looked in depth within the Splitwise app. Apartment inventories can be managed through the app. Chores can be assigned to roommates and can be scheduled for completion or can be recurring as well.

## How we built it
We decided that Node.js was the best option for our backend system, because of the large support community which would make it easier to develop in a fast environment. We shipped our backend services to AWS. Elastic Beanstalk was used for the application deployment. RDS was used for database management. The app was created in Swift, because it was a much different UI kit than what we have used before. It also provides a rich UI library that allows us to create a tailored experience needed for the app requirements.

## Challenges we ran into

The Splitwise API caused problems because of certain deprecated components and wrapper libraries that do not fully support the API. However we used workarounds to maintain our app requirements even though API was not as comprehensive as we thought. Developing in Swift UI also proved to be more tedious than anctipated.

## Accomplishments that we're proud of
* Setting up a robust and complex relational database schema
* Complete integration with the Splitwise API
* Full hosting on AWS
* Well-designed and intuitive UI layout
## What we learned
* Cloud deployments for web apps
* Swift UI Design
## What's next for Livv
* GCal Integration
* Widget layouts in UI
