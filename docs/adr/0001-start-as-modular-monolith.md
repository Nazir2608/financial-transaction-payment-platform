# ADR-0001: Start as a Modular Monolith

## Status

Accepted

## Decision

FINCORE starts as a modular monolith and is decomposed into microservices only after the domain boundaries and distributed-system problems are understood.

## Why

Starting with microservices would introduce infrastructure complexity before we understand the business domain.

The monolith lets us learn:

- transaction boundaries
- domain modelling
- state transitions
- idempotency
- concurrency
- database design

before introducing network calls, distributed transactions, Kafka, service discovery, and independent deployments.
