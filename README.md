# Archibald - Demo UI
 This is a demonstration user interface which shows an Archimate UI, with hard-coded arhcimate nodes and edges. This is a precursor to a more full-fledged UI that will connect to a back-end graph database hosting archimate data. This utilizes hard-coded data that shows all of the basic Archimate items. 

## Todo Features:
  - Add ability to move edges between node anchors
  - Add node data view - a view attached to nodes that show node-specific data
  - Add Junction for Edges 
  - Add ability to add edge anchors to allow more then five segments
  - Add ability to delete edge anchors
  - Add rule processing for connectors
  - Add Product card
  - add nesting of items with resizable cards

## Known Issues:
  - Selecting Edge does not update Edge Data UI component with current edge
  - Issues with drag and drop within SVG canvas makes it difficult to drag items - this is especially prevalent when trying to add a new edge
  - The Communication Network is currently using Archimate 3.1 graphic

## Overview
This demo shows all of the Archimate 3.2 cards and allows them to be connected using the Archimate connectors as defined in the [Archimate 3.2](https://pubs.opengroup.org/architecture/archimate32-doc/index.html) definition. Archimate is a metamodel language for modeling enterprise architecture. This UI shows a complete set of the Archimate "cards". These cards are rendered on an SVG canvas and allow the user to move them and connect them utilizing the standard Archimate connectors.

### Nodes
| Name | Layer | Type | Description | 
| --- | --- | --- | --- |
| Collaboration | Application | Structure | |
| Component | Application | Structure | |
| DataObject | Application | Structure | |
| Event | Application | Behavior  | |
| Function | Application | Behavior | |
| Interaction | Application | Behavior | |
| Interface | Application | Structure | |
| Process | Application | Behavior | |
| Service | Application | Behavior | |
| Actor | Business | Structure | An actor is a business entity that performs a behavior - this could be a person, or a departmnent of organizational unit. Actors are often assigned roles. |
| Collaboration | Business | Structure | A collaboration occurs when two structure elements work together to perform a behavior. |
| Contract | Business | Passive Structure| |
| Event| Business | Behavior | A business event is an instantaneous occurance that impacts (starts, interrupts) a business process. |
| Function | Business | Behavior | |
| Interaction | Business | Behavior | When two or more roles come together to |
| Interface | Business | Structure | A business interace represents a channel through which business services are exposed. For example, the web, telephone, store, etc. |
| Object | Business | Passive Structure | |
| Process | Business | Behavior | Products and services are produced by business processes, which are internal complex chains of activities by roles to realize the service or product. |
| Product | Business | Passive Structure | |
| Representation | Business | Passive Structure | Representations are units of information, such as forms or messages. A representation will be  |
| Role | Business | Structure | Roles represent the responsibility for performing specific behaviors. For example, an actor may be assigned a role to process applications. |
| Service | Business | Behavior | Represents a specific behavior that is exposed by the business. It is performed by an actor, role or through a specific collaboration. |
| Assessment | Motivation | Motivation | |
| Constraint | Motivation | Motivation | |
| Driver | Motivation | Motivation | |
| Goal | Motivation | Motivation | |
| Meaning | Motivation | Motivation | |
| Outcome | Motivation | Motivation | |
| Principle | Motivation | Motivation | |
| Requirement| Motivation | Motivation | |
| Stakeholder | Motivation | Motivation | |
| Value | Motivation | Motivation | |
| Capability | Strategy | Behavior | |
| Course of Action | Strategy | Behavior | |
| Resource | Strategy | Structure  | |
| Value Stream | Strategy | Behavior | |
| Artifact | Technology | Structure | |
| Collaboration | Technology | Structure | |
| Communication Network | Technology | Structure | |
| Device | Technology | Structure | |
| Event | Technology | Behavior | |
| Function | Technology | Behavior | |
| Interation | Technology | Behavior | |
| Interface | Technology | Structure | |
| Node | Technology | Behavior| |
| Path | Technology | Structure | |
| Process | Technology | Behavior | |
| Service | Technology | Structure | |
| System Software | Technology | Structure | |
  
  ### Edges 
  | Name | Type | Description |
  | -- | -- | -- |
  | Aggregation | Structural | |
  | Assignment | Structural | |
  | Association | Dependency | |
  | Access | Structural | |
  | Flow | Dynamic | |
  | Influence | Dependency |  |
  | Composition | Structural | |
  | Realization | Dependency | |
  | Serving | Dependency |
  | Specialization | Other |
  | Trigering | Dynamic | |