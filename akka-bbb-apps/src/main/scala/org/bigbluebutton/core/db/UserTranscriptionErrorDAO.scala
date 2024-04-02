package org.bigbluebutton.core.db

import org.bigbluebutton.core.models.{ VoiceUserState }
import slick.jdbc.PostgresProfile.api._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{ Failure, Success }

case class UserTranscriptionErrorDbModel(
    userId:        String,
    meetingId:     String,
    errorCode:     String,
    errorMessage:  String,
    lastUpdatedAt: java.sql.Timestamp = new java.sql.Timestamp(System.currentTimeMillis())
)

class UserTranscriptionErrorDbTableDef(tag: Tag) extends Table[UserTranscriptionErrorDbModel](tag, None, "user_transcriptionError") {
  override def * = (
    userId, meetingId, errorCode, errorMessage, lastUpdatedAt
  ) <> (UserTranscriptionErrorDbModel.tupled, UserTranscriptionErrorDbModel.unapply)
  val userId = column[String]("userId", O.PrimaryKey)
  val meetingId = column[String]("meetingId")
  val errorCode = column[String]("errorCode")
  val errorMessage = column[String]("errorMessage")
  val lastUpdatedAt = column[java.sql.Timestamp]("lastUpdatedAt")
}

object UserTranscriptionErrorDAO {
  def insert(userId: String, meetingId: String, errorCode: String, errorMessage: String) = {
    DatabaseConnection.db.run(
      TableQuery[UserTranscriptionErrorDbTableDef].insertOrUpdate(
        UserTranscriptionErrorDbModel(
          userId = userId,
          meetingId = meetingId,
          errorCode = errorCode,
          errorMessage = errorMessage,
          lastUpdatedAt = new java.sql.Timestamp(System.currentTimeMillis()),
        )
      )
    ).onComplete {
        case Success(rowsAffected) => {
          DatabaseConnection.logger.debug(s"$rowsAffected row(s) inserted on user_transcriptionError table!")
        }
        case Failure(e) => DatabaseConnection.logger.debug(s"Error inserting user_transcriptionError: $e")
      }
  }

}
