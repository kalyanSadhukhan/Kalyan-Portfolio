# Use Java 17 runtime
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy project
COPY . .

# Build application
RUN ./mvnw clean package -DskipTests

# Run application
CMD ["java", "-jar", "target/*.jar"]
