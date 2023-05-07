<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Members>
 */
class MemberFactory extends Factory
{
  /**
   * Define the model's default state.
   *
   * @return array<string, mixed>
   */
  public function definition(): array
  {
    return [
      'cid' => $this->faker->unique()->numberBetween($min = 1, $max = 100),
      'name' => $this->faker->name,
      'dob' => $this->faker->dateTimeBetween('-30 year', '-18 year'),
      'occupation' => $this->faker->jobTitle,
      'age' => $this->faker->numberBetween(20, 60),
      'gender' => $this->faker->randomElement(['Male', 'Female']),
      'civil_status' => $this->faker->randomElement(['Married', 'Single']),
      'address' => $this->faker->randomElement(["BINOGSACAN UPPER, GUINOBATAN, ALBAY", "CABUGAN, BURUANGA, AKLAN", "BANGCUD, CITY OF MALAYBALAY, BUKIDNON", "BATBAT, GUINOBATAN, ALBAY", "ESPERANZA, ALOGUINSAN, CEBU"]),
      'contact' => $this->faker->phoneNumber,
      'tin' => $this->faker->unique()->randomNumber($nbDigits = 9),
      'registration_date' => $this->faker->dateTimeBetween('-3 year', 'now'),
      'created_at' => now(),
      'updated_at' => now(),
    ];
  }
}
