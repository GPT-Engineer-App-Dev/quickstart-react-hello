import { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, VStack, HStack, Text } from '@chakra-ui/react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent, useVenues } from '../integrations/supabase/index.js';

const Events = () => {
  const { data: events, isLoading: eventsLoading, error: eventsError } = useEvents();
  const { data: venues, isLoading: venuesLoading, error: venuesError } = useVenues();
  const addEvent = useAddEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [formState, setFormState] = useState({ id: null, name: '', date: '', venue: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState.id) {
      updateEvent.mutate(formState);
    } else {
      addEvent.mutate(formState);
    }
    setFormState({ id: null, name: '', date: '', venue: '' });
  };

  const handleEdit = (event) => {
    setFormState(event);
  };

  const handleDelete = (id) => {
    deleteEvent.mutate(id);
  };

  if (eventsLoading || venuesLoading) return <Text>Loading...</Text>;
  if (eventsError || venuesError) return <Text>Error loading data</Text>;

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="name">
            <FormLabel>Name</FormLabel>
            <Input type="text" name="name" value={formState.name} onChange={handleChange} required />
          </FormControl>
          <FormControl id="date">
            <FormLabel>Date</FormLabel>
            <Input type="date" name="date" value={formState.date} onChange={handleChange} required />
          </FormControl>
          <FormControl id="venue">
            <FormLabel>Venue</FormLabel>
            <Select name="venue" value={formState.venue} onChange={handleChange} required>
              <option value="">Select a venue</option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" colorScheme="blue">
            {formState.id ? 'Update Event' : 'Add Event'}
          </Button>
        </VStack>
      </form>
      <VStack spacing={4} mt={8}>
        {events.map((event) => (
          <HStack key={event.id} spacing={4} w="100%" justifyContent="space-between">
            <Text>{event.name}</Text>
            <Text>{event.date}</Text>
            <HStack spacing={2}>
              <Button size="sm" onClick={() => handleEdit(event)}>
                Edit
              </Button>
              <Button size="sm" colorScheme="red" onClick={() => handleDelete(event.id)}>
                Delete
              </Button>
            </HStack>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default Events;